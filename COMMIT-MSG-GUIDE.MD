Unfortunately github doesn't support commit-msg webhooks but you can enforce the commit-msg style locally with the following steps.

 - ```touch commit-msg .git/hooks/```
 - ```rm .git/hooks/commit-msg.sample```
 - ```chmod +x .git/hooks/commit-msg```
 - ```open .git/hooks/commit-msg```
 - copy the content of https://gist.github.com/onjin/5442494 into your commit-msg and save it.

