function_help()
{
   echo ""
   echo "Usage: $0 -u my-github-username -d build-directory"
   echo -e "\t-u Your GitHub username. Required."
   echo -e "\t-d Build directory where the site is saved. If you don't provide this parameter, the site is built in the ../build directory."
   echo -e "\t-r Remove build directory automatically when done."
   exit 0
}

while getopts d:u: option
do
   case $option in
      d) build_dir=${OPTARG};;        
      u) gh_username=${OPTARG};;
      ?) function_help;;
   esac
done

if [ -z "${gh_username}" ]; then 
    echo 'GitHub username is required.'
    function_help
fi

if [ -z "${build_dir}" ]; then 
    build_dir='../build'
fi

echo "Building site into the directory ${build_dir}."
echo "GitHub username is ${gh_username}."

# Create a config file to override the url and baseurl 
echo "baseurl: \"\"" >> _config_temp.yml
echo "url: \"https://${gh_username}.github.io\"" >> _config_temp.yml

bundle exec jekyll build --config _config.yml,_config_temp.yml --destination ${build_dir} --incremental

# Remove the temp config file
rm _config_temp.yml

cd ${build_dir}
touch .nojekyll
git init
git remote add origin "git@github.com:${gh_username}/${gh_username}.github.io.git"
git add -A
git commit -sm "GitHub pages update $(date)"
# Force updates in case of conflicts
git push -f --set-upstream origin master

# Delete the build directory
echo "Done building GitHub pages. You can now safely delete the directory ${build_dir}."
exit 0