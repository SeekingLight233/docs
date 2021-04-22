git add .
git commit -m"append"
git push -u origin master

cd ..
npm run build
cd public
git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
git remote add origin https://gitee.com/SeekingLight/SeekingLight
git push -f origin master
cd docs