[简体中文](#) | [English](./README.en.md)

# easyeda-copycat

嘉立创EDA & EasyEDA 专业版扩展 Copycat, 一个支持从不同的PCB中保存和恢复元件位置信息和引脚网络的工具，由于扩展API的问题，引脚网络恢复功能处于不可用状态（WIP）.

<a href="https://github.com/puppywang/easyeda-copycat" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/stars/puppywang/easyeda-copycat" alt="GitHub Repo Stars" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://github.com/puppywang/easyeda-copycat/issues" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/issues/puppywang/easyeda-copycat" alt="GitHub Issues" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://github.com/puppywang/easyeda-copycat" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/repo-size/puppywang/easyeda-copycat" alt="GitHub Repo Size" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>&nbsp;<a href="https://choosealicense.com/licenses/apache-2.0/" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/license/puppywang/easyeda-copycat" alt="GitHub License" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>

> [!NOTE]
>
> 本工具方便保存立创EDA & EasyEDA 专业版中的PCB元件位置和信息和引脚网络信息，方便在不同版本的PCB中还原，降低在同一个工程中维护多个版本原理图和PCB的复杂度，但由于扩展API的问题，引脚网络恢复功能处于不可用状态（WIP）.

## 进入开发

1. 克隆 [easyeda-copycat](https://github.com/puppywang/easyeda-copycat) 项目仓库到本地

    GitHub:

    ```shell
    git clone --depth=1 https://github.com/puppywang/easyeda-copycat.git
    ```

2. 初始化开发环境（安装依赖）

    ```shell
    npm install
    ```

3. 进行些许变更 ...

4. 编译扩展包

    ```shell
    npm run build
    ```

5. 在 嘉立创EDA专业版 中安装生成在 `./build/dist/` 下的扩展包

## 开源许可

<a href="https://choosealicense.com/licenses/apache-2.0/" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/license/puppywang/easyeda-copycat" alt="GitHub License" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>
