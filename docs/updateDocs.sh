git add .
git commit -m"update"
git push -u origin master 

cd ./public
tcb hosting deploy -e blog-0gffwt1p75eb1c71
cd ..
