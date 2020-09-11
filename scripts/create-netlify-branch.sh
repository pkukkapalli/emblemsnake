git checkout -b netlify || git checkout netlify
rm Pipfile*
git add .
git commit -m "Deploy"
git push origin netlify
