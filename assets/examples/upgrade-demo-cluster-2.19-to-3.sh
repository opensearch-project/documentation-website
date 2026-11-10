#!/bin/bash
#
# Deploys a four-node OpenSearch cluster and one OpenSearch Dashboards node in
# Docker for the rolling upgrade lab:
# https://docs.opensearch.org/latest/migrate-or-upgrade/rolling-upgrade/rolling-upgrade-lab/
#
# Run this script from ~/deploy. Set the password for the admin user first:
#
#   export OPENSEARCH_INITIAL_ADMIN_PASSWORD='<custom-admin-password>'
#   bash upgrade-demo-cluster-2.19-to-3.sh
#
# All published ports are bound to 127.0.0.1, so the cluster is reachable only
# from the Docker host.

set -e

# OpenSearch and OpenSearch Dashboards versions to deploy.
os_version=2.19.6
osd_version=2.19.6

# This value determines how many OpenSearch nodes are created.
# Default is 4 - if you plan on increasing this value make
# sure that your host has the resources for running
# a larger cluster. Additionally, if you modify this value
# you will need to revise plugins.security.nodes_dn in each
# node's opensearch.yml file, and you will need to add entries
# for the additional nodes in opensearch_dashboards.yml.
os_node_count=4

if [ -z "${OPENSEARCH_INITIAL_ADMIN_PASSWORD}" ]; then
	echo "Set the OPENSEARCH_INITIAL_ADMIN_PASSWORD environment variable to the password for the admin user, then run this script again." >&2
	exit 1
fi

# Create Docker network if it doesn't exist. A subnet is defined
# so that static IP addresses can be assigned to individual containers
# for TLS certificate SANs purposes.
create_network()	{
	docker network create --subnet=172.20.0.0/16 opensearch-dev-net || true
}

# Define the TLS certificates for the cluster. This function will
# generate a root certificate and key, an admin certificate and key,
# and node certificates for each node in the cluster including
# OpenSearch Dashboards.
create_certs()	{
	# Create the root cert.
	openssl genrsa -out root-ca-key.pem 2048
	openssl req -new -x509 -sha256 -key root-ca-key.pem -subj "/C=US/ST=OREGON/L=PORTLAND/O=OPENSEARCH/OU=DOCS/CN=ROOT" -out root-ca.pem -days 730

	# Create the admin cert.
	openssl genrsa -out admin-key-temp.pem 2048
	openssl pkcs8 -inform PEM -outform PEM -in admin-key-temp.pem -topk8 -nocrypt -out admin-key.pem
	openssl req -new -key admin-key.pem -subj "/C=US/ST=OREGON/L=PORTLAND/O=OPENSEARCH/OU=DOCS/CN=A" -out admin.csr
	openssl x509 -req -in admin.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out admin.pem -days 730

	# Create OpenSearch node certs.
	for ((i=1; i <= $os_node_count; i++)); do
		openssl genrsa -out os-node-0${i}-key-temp.pem 2048
		openssl pkcs8 -inform PEM -outform PEM -in os-node-0${i}-key-temp.pem -topk8 -nocrypt -out os-node-0${i}-key.pem
		openssl req -new -key os-node-0${i}-key.pem -subj "/C=US/ST=OREGON/L=PORTLAND/O=OPENSEARCH/OU=DOCS/CN=os-node-0${i}" -out os-node-0${i}.csr
		echo "subjectAltName=DNS:os-node-0${i},IP:172.20.0.1${i}" > os-node-0${i}.ext
		openssl x509 -req -in os-node-0${i}.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out os-node-0${i}.pem -days 730 -extfile os-node-0${i}.ext
	done

	# Create OpenSearch Dashboards cert.
	openssl genrsa -out os-dashboards-01-key-temp.pem 2048
	openssl pkcs8 -inform PEM -outform PEM -in os-dashboards-01-key-temp.pem -topk8 -nocrypt -out os-dashboards-01-key.pem
	openssl req -new -key os-dashboards-01-key.pem -subj "/C=US/ST=OREGON/L=PORTLAND/O=OPENSEARCH/OU=DOCS/CN=os-dashboards-01" -out os-dashboards-01.csr
	echo "subjectAltName=DNS:os-dashboards-01,DNS:localhost,IP:172.20.0.10,IP:127.0.0.1" > os-dashboards-01.ext
	openssl x509 -req -in os-dashboards-01.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out os-dashboards-01.pem -days 730 -extfile os-dashboards-01.ext
}

# Remove unneeded artifacts from TLS cert creation.
clean_up_certs()	{
	rm *temp.pem *csr *ext
}

# Hash a password using the tool included in the OpenSearch image.
hash_password()	{
	docker run --rm \
		--entrypoint /usr/share/opensearch/plugins/opensearch-security/tools/hash.sh \
		opensearchproject/opensearch:${os_version} -p "$1" | tail -n 1
}

# Write the internal users file that initializes the Security plugin.
# The admin user receives the password in OPENSEARCH_INITIAL_ADMIN_PASSWORD.
# The kibanaserver user, which OpenSearch Dashboards uses to connect to
# OpenSearch, receives a randomly generated password.
write_security_configs()	{
	kibanaserver_password=$(openssl rand -hex 16)
	admin_hash=$(hash_password "${OPENSEARCH_INITIAL_ADMIN_PASSWORD}")
	kibanaserver_hash=$(hash_password "${kibanaserver_password}")
	cat <<- EOF > internal_users.yml
	---
	_meta:
	  type: "internalusers"
	  config_version: 2
	admin:
	  hash: "${admin_hash}"
	  reserved: true
	  backend_roles:
	  - "admin"
	  description: "Admin user"
	kibanaserver:
	  hash: "${kibanaserver_hash}"
	  reserved: true
	  description: "OpenSearch Dashboards user"
	EOF
}

# Write config files for OpenSearch nodes.
write_os_configs ()	{
	for ((i=1; i <= $os_node_count; i++)); do
		cat <<- EOF > opensearch-0${i}.yml
		---
		# Node and cluster config
		cluster.name: opensearch-dev-cluster
		node.name: os-node-0${i}
		cluster.initial_cluster_manager_nodes: ["os-node-01","os-node-02","os-node-03","os-node-04"]
		discovery.seed_hosts: ["os-node-01","os-node-02","os-node-03","os-node-04"]
		bootstrap.memory_lock: true
		path.repo: /usr/share/opensearch/snapshots
		network.host: 0.0.0.0

		# Security plugin
		plugins.security.ssl.transport.pemcert_filepath: /usr/share/opensearch/config/os-node-0${i}.pem
		plugins.security.ssl.transport.pemkey_filepath: /usr/share/opensearch/config/os-node-0${i}-key.pem
		plugins.security.ssl.transport.pemtrustedcas_filepath: /usr/share/opensearch/config/root-ca.pem
		plugins.security.ssl.http.enabled: true
		plugins.security.ssl.http.pemcert_filepath: /usr/share/opensearch/config/os-node-0${i}.pem
		plugins.security.ssl.http.pemkey_filepath: /usr/share/opensearch/config/os-node-0${i}-key.pem
		plugins.security.ssl.http.pemtrustedcas_filepath: /usr/share/opensearch/config/root-ca.pem
		plugins.security.allow_default_init_securityindex: true
		plugins.security.authcz.admin_dn:
		  - 'CN=A,OU=DOCS,O=OPENSEARCH,L=PORTLAND,ST=OREGON,C=US'
		plugins.security.nodes_dn:
		  - 'CN=os-node-01,OU=DOCS,O=OPENSEARCH,L=PORTLAND,ST=OREGON,C=US'
		  - 'CN=os-node-02,OU=DOCS,O=OPENSEARCH,L=PORTLAND,ST=OREGON,C=US'
		  - 'CN=os-node-03,OU=DOCS,O=OPENSEARCH,L=PORTLAND,ST=OREGON,C=US'
		  - 'CN=os-node-04,OU=DOCS,O=OPENSEARCH,L=PORTLAND,ST=OREGON,C=US'
		plugins.security.audit.type: internal_opensearch
		plugins.security.enable_snapshot_restore_privilege: true
		plugins.security.check_snapshot_restore_write_privileges: true
		plugins.security.restapi.roles_enabled: ["all_access","security_rest_api_access"]
		EOF
	done
}

# Write config file for OpenSearch Dashboards.
write_osd_configs ()	{
	cat <<- EOF > opensearch_dashboards.yml
	---
	server.host: "0.0.0.0"
	server.name: "opensearch-dashboards-dev"
	opensearch.hosts: ["https://172.20.0.11:9200","https://172.20.0.12:9200","https://172.20.0.13:9200","https://172.20.0.14:9200"]
	opensearch.ssl.verificationMode: full
	opensearch.username: "kibanaserver"
	opensearch.password: "${kibanaserver_password}"
	opensearch.requestHeadersAllowlist: [ "authorization","securitytenant" ]
	server.ssl.enabled: true
	server.ssl.certificate: /usr/share/opensearch-dashboards/config/os-dashboards-01.pem
	server.ssl.key: /usr/share/opensearch-dashboards/config/os-dashboards-01-key.pem
	opensearch.ssl.certificateAuthorities: ["/usr/share/opensearch-dashboards/config/root-ca.pem"]
	opensearch_security.multitenancy.enabled: true
	opensearch_security.multitenancy.tenants.preferred: ["Private", "Global"]
	opensearch_security.readonly_mode.roles: ["kibana_read_only"]
	opensearch_security.cookie.secure: true
	EOF
}

# Set permissions on the generated files. The OpenSearch and OpenSearch
# Dashboards containers run as UID 1000, which differs from the host user
# on many systems, so the files mounted into the containers must be
# readable by all users. The ~/deploy directory is restricted to the host
# user so that other host users can't reach the private keys. The root CA
# private key isn't mounted into any container and stays private.
set_file_permissions()	{
	chmod 700 ~/deploy
	chmod 644 *.pem *.yml
	chmod 600 root-ca-key.pem
}

# Initialize the snapshot repo
# This solves a problem I was running into where a mounted volume
# was owned by root:root within the container. Rather than modifying
# the Dockerfile and building my own images, I'm just using a solution
# I found on stackoverflow: https://serverfault.com/a/984599
snapshot_repo_init()	{
	docker run --rm -v repo-01:/usr/share/opensearch/snapshots busybox \
		/bin/sh -c 'chown -R 1000:1000 /usr/share/opensearch/snapshots'
}

# Launch each node. Port 9200 of each node is published only on the
# loopback interface of the host (127.0.0.1).
launch_nodes()	{
	for ((i=1; i <= $os_node_count; i++)); do
		docker run -d \
			-p 127.0.0.1:920${i}:9200 \
			-e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
			-e "DISABLE_INSTALL_DEMO_CONFIG=true" \
			--ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
			-v data-0${i}:/usr/share/opensearch/data \
			-v repo-01:/usr/share/opensearch/snapshots \
			-v ~/deploy/opensearch-0${i}.yml:/usr/share/opensearch/config/opensearch.yml \
			-v ~/deploy/internal_users.yml:/usr/share/opensearch/config/opensearch-security/internal_users.yml \
			-v ~/deploy/root-ca.pem:/usr/share/opensearch/config/root-ca.pem \
			-v ~/deploy/admin.pem:/usr/share/opensearch/config/admin.pem \
			-v ~/deploy/admin-key.pem:/usr/share/opensearch/config/admin-key.pem \
			-v ~/deploy/os-node-0${i}.pem:/usr/share/opensearch/config/os-node-0${i}.pem \
			-v ~/deploy/os-node-0${i}-key.pem:/usr/share/opensearch/config/os-node-0${i}-key.pem \
			--network opensearch-dev-net \
			--ip 172.20.0.1${i} \
			--name os-node-0${i} \
			opensearchproject/opensearch:${os_version}
	done
}

# Launch OpenSearch Dashboards. Port 5601 is published only on the
# loopback interface of the host (127.0.0.1).
launch_node_dashboards()	{
	docker run -d \
		-p 127.0.0.1:5601:5601 \
		-v ~/deploy/opensearch_dashboards.yml:/usr/share/opensearch-dashboards/config/opensearch_dashboards.yml \
		-v ~/deploy/root-ca.pem:/usr/share/opensearch-dashboards/config/root-ca.pem \
		-v ~/deploy/os-dashboards-01.pem:/usr/share/opensearch-dashboards/config/os-dashboards-01.pem \
		-v ~/deploy/os-dashboards-01-key.pem:/usr/share/opensearch-dashboards/config/os-dashboards-01-key.pem \
		--network opensearch-dev-net \
		--ip 172.20.0.10 \
		--name os-dashboards-01 \
		opensearchproject/opensearch-dashboards:${osd_version}
}

create_network
create_certs
clean_up_certs
write_security_configs
write_os_configs
write_osd_configs
set_file_permissions
snapshot_repo_init
launch_nodes
launch_node_dashboards
