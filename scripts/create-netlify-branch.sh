git checkout -b netlify || git checkout netlify
git pull
rm Pipfile*
git add .
git commit -m "Deploy"
git push origin netlify
