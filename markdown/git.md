### git 技巧

#### 提交某个文件到 git 之后想要忽略该文件

```yaml
git rm -r --cached .
git add .
git commit -m 'update .gitignore'
git push -u origin master
```

#### 使用 Git amend 命令修改最新的提交记录

Git amend 命令可以修改最新一次的提交记录。下面是使用该命令的步骤：

1. 首先，使用 `git commit --amend` 命令来修改最新的提交记录。这会打开一个编辑器，允许你修改提交信息。

2. 在编辑器中，修改提交信息并保存。

3. 最后，使用 `git push --force` 命令将修改后的提交记录推送到远程仓库。注意，这里使用了 `--force` 选项来覆盖远程仓库中的提交记录。

具体使用示例如下：

```yaml
# 打开文本编辑器，修改最新的提交消息
git commit --amend

  # 编辑器打开后，修改提交信息为正确的信息。保存并关闭编辑器。
git push --force
```

#### 使用 Git rebase 命令修改多个提交记录

如果需要修改多个提交记录，可以使用 Git rebase 命令来实现。下面是使用该命令的步骤：

1. 首先，使用 git log 命令查看需要修改的提交记录的哈希值。记住需要修改的提交之前的提交哈希值。

2. 接下来，使用 git rebase -i <commit> 命令来打开一个交互式的界面，其中 <commit> 是需要修改的提交之前的提交哈希值。

3. 在交互式界面中，将需要修改的提交的命令从 pick 改为 edit。保存并关闭编辑器。

4. 修改操作会进入每个需要修改的提交之前的状态。对于每个提交，使用 `git commit --amend` 命令来修改提交信息。保存并关闭编辑器。

5. 当完成所有修改后，使用 `git rebase --continue` 命令继续进行 rebase 操作。

6. 最后，使用 `git push --force` 命令将修改后的提交记录推送到远程仓库。

具体使用示例如下：

```yaml
# 查看需要修改的提交记录的哈希值，记住其中一个提交的哈希值。
git log

  # 变基到指定的某个 commit
git rebase -i <commit>

  # 在交互式界面中，将需要修改的提交的命令从 pick 改为 edit。保存并关闭编辑器。
git commit --amend

  # 编辑器打开后，修改提交信息为正确的信息。保存并关闭编辑器。
git rebase --continue

  # 重复上述步骤，直到所有需要修改的提交记录都被修改完毕
git push --force
```
