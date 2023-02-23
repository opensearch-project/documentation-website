---
layout: default
title: Appendix
parent: Upgrading OpenSearch
nav_order: 99
---

# Appendix

Refer to the topics in this appendix for additional supporting documentation, such as example API requests and configuration files that were used for testing and validation of steps in upgrade procedures. If you would like to request specific topics to include in this appendix, please comment on the [upgrade and migration documentation meta issue](https://github.com/opensearch-project/documentation-website/issues/2830) in the [OpenSearch Project](https://github.com/opensearch-project) on GitHub.

Specific commands are included in this document to serve as examples of interacting with the OpenSearch API, and the underlying host, in order to achieve the same results described in the related upgrade process documents. The intention is not to be overly prescriptive, but instead to add context for users that are new to OpenSearch who want to see practical examples.
{:.note}

## Rolling upgrade

The rolling upgrade procedure was tested and validated on a Linux host running [Amazon Linux 2](https://aws.amazon.com/amazon-linux-2/) with [Docker](https://www.docker.com/). You can follow these steps to recreate the same cluster state used for generating the procedure if you want to try the upgrade process in a test environment yourself.

1. Install [Docker](https://www.docker.com/).
1. 

The following command is executed prior to deploying any nodes to ensure that artifacts from previous testing are erased:
```bash
docker container stop $(docker container ls -aq) ; docker container rm $(docker container ls -aq) ; docker volume rm -f $(docker volume ls -q) ; docker network rm $(docker network ls -q)
```


```bash
#! /bin/bash

# This value determines how many worker nodes are created
node_count=4

# Create Docker network if it doesn't exist
create_network()	{
	docker network create --subnet=172.20.0.0/16 opensearch-dev-net || true
}	

# Define the TLS certificates for the cluster
create_certs()	{
	# Create the root cert
	openssl genrsa -out root-ca-key.pem 2048
	openssl req -new -x509 -sha256 -key root-ca-key.pem -subj "/C=US/ST=OREGON/L=PORTLAND/O=OPENSEARCH/OU=DOCS/CN=ROOT" -out root-ca.pem -days 730

	# Create the admin cert
	openssl genrsa -out admin-key-temp.pem 2048
	openssl pkcs8 -inform PEM -outform PEM -in admin-key-temp.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out admin-key.pem
	openssl req -new -key admin-key.pem -subj "/C=US/ST=OREGON/L=PORTLAND/O=OPENSEARCH/OU=DOCS/CN=A" -out admin.csr
	openssl x509 -req -in admin.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out admin.pem -days 730

	# Create OpenSearch node certs
	for ((i=1; i <= $node_count; i++)); do
		openssl genrsa -out os-node-0${i}-key-temp.pem 2048
		openssl pkcs8 -inform PEM -outform PEM -in os-node-0${i}-key-temp.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out os-node-0${i}-key.pem
		openssl req -new -key os-node-0${i}-key.pem -subj "/C=US/ST=OREGON/L=PORTLAND/O=OPENSEARCH/OU=DOCS/CN=os-node-0${i}" -out os-node-0${i}.csr
		echo "subjectAltName=DNS:os-node-0${i}" | tee -a os-node-0${i}.ext
		echo "subjectAltName=IP:172.20.0.1${i}" | tee -a os-node-0${i}.ext
		openssl x509 -req -in os-node-0${i}.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out os-node-0${i}.pem -days 730 -extfile os-node-0${i}.ext
	done

	# Create OpenSearch Dashboards certs
	openssl genrsa -out os-dashboards-01-key-temp.pem 2048
	openssl pkcs8 -inform PEM -outform PEM -in os-dashboards-01-key-temp.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out os-dashboards-01-key.pem
	openssl req -new -key os-dashboards-01-key.pem -subj "/C=US/ST=OREGON/L=PORTLAND/O=OPENSEARCH/OU=DOCS/CN=os-dashboards-01" -out os-dashboards-01.csr
	echo 'subjectAltName=DNS:os-dashboards-01' | tee -a os-dashboards-01.ext
	echo 'subjectAltName=IP:172.20.0.10' | tee -a os-dashboards-01.ext
	openssl x509 -req -in os-dashboards-01.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out os-dashboards-01.pem -days 730 -extfile os-dashboards-01.ext
}

# Removes unneeded artifacts from TLS cert creation
clean_up_certs()	{
	rm *temp.pem *csr *ext
}


# Write config files
write_os_configs ()	{
	for ((i=1; i <= $node_count; i++)); do
		cat <<- EOF > opensearch-0${i}.yml
		---
		# Moved from the docker run commands
		cluster.name: opensearch-dev-cluster
		node.name: os-node-0${i}
		cluster.initial_master_nodes: ["os-node-01","os-node-02","os-node-03","os-node-04"]
		discovery.seed_hosts: ["os-node-01","os-node-02","os-node-03","os-node-04"]
		bootstrap.memory_lock: true
		path.repo: /usr/share/opensearch/snapshots

		# Bind to all interfaces because we don't know what IP address Docker will assign to us.
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

# Write dashboard config file
write_osd_configs ()	{
	cat <<-'EOF' > opensearch_dashboards.yml
	---
	server.host: "0.0.0.0"
	server.name: "jeffh-dev"
	opensearch.hosts: ["https://172.20.0.11:9200","https://172.20.0.12:9200","https://172.20.0.13:9200","https://172.20.0.14:9200"]
	opensearch.ssl.verificationMode: full
	opensearch.username: "kibanaserver"
	opensearch.password: "kibanaserver"
	opensearch.requestHeadersWhitelist: [ "authorization","securitytenant" ]
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

# Initialize the snapshot repo
# This solves a problem I was running into where a mounted volume
# was owned by root:root within the container. Rather than modifying
# the Dockerfile and building my own images, I'm just using a solution
# I found on stackoverflow: https://serverfault.com/a/984599
snapshot_repo_init()	{
	docker run --rm -v repo-01:/usr/share/opensearch/snapshots busybox \
  		/bin/sh -c 'chown -R 1000:1000 /usr/share/opensearch/snapshots'
}

# Launch each node
launch_nodes()	{
	for ((i=1; i <= $node_count; i++)); do
		docker run -d \
			-p 920${i}:9200 -p 960${i}:9600 \
			-e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
			--ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
			-v data-0${i}:/usr/share/opensearch/data \
		  	-v repo-01:/usr/share/opensearch/snapshots \
		  	-v /home/ec2-user/backups/1.3/deploy/opensearch-0${i}.yml:/usr/share/opensearch/config/opensearch.yml \
		  	-v /home/ec2-user/backups/1.3/deploy/root-ca.pem:/usr/share/opensearch/config/root-ca.pem \
		  	-v /home/ec2-user/backups/1.3/deploy/admin.pem:/usr/share/opensearch/config/admin.pem \
		  	-v /home/ec2-user/backups/1.3/deploy/admin-key.pem:/usr/share/opensearch/config/admin-key.pem \
		  	-v /home/ec2-user/backups/1.3/deploy/os-node-0${i}.pem:/usr/share/opensearch/config/os-node-0${i}.pem \
		  	-v /home/ec2-user/backups/1.3/deploy/os-node-0${i}-key.pem:/usr/share/opensearch/config/os-node-0${i}-key.pem \
			--network opensearch-dev-net \
			--ip 172.20.0.1${i} \
			--name os-node-0${i} \
			opensearchproject/opensearch:1.3.7
	done
}

launch_node_dashboards()	{
	docker run -d \
		-p 5601:5601 --expose 5601 \
		-v /home/ec2-user/backups/1.3/deploy/opensearch_dashboards.yml:/usr/share/opensearch-dashboards/config/opensearch_dashboards.yml \
		-v /home/ec2-user/backups/1.3/deploy/root-ca.pem:/usr/share/opensearch-dashboards/config/root-ca.pem \
		-v /home/ec2-user/backups/1.3/deploy/os-dashboards-01.pem:/usr/share/opensearch-dashboards/config/os-dashboards-01.pem \
		-v /home/ec2-user/backups/1.3/deploy/os-dashboards-01-key.pem:/usr/share/opensearch-dashboards/config/os-dashboards-01-key.pem \
		--network opensearch-dev-net \
		--ip 172.20.0.10 \
		--name os-dashboards-01 \
		opensearchproject/opensearch-dashboards:1.3.7
}

create_network
create_certs
clean_up_certs
write_os_configs
write_osd_configs
snapshot_repo_init
launch_nodes
launch_node_dashboards
```