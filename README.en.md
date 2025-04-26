[简体中文](#) | [English](./README.en.md)

# easyeda-copycat

An extension for JLCPCB EDA & EasyEDA Pro called **Copycat**, which lets you save and restore component positions and pin-net connectivity across different PCB designs. Due to limitations in the extension API, the pin-net restoration feature is currently unavailable (WIP).

<a href="https://github.com/puppywang/easyeda-copycat" target="_blank"><img src="https://img.shields.io/github/stars/puppywang/easyeda-copycat" alt="GitHub Repo Stars" /></a>&nbsp;<a href="https://github.com/puppywang/easyeda-copycat/issues" target="_blank"><img src="https://img.shields.io/github/issues/puppywang/easyeda-copycat" alt="GitHub Issues" /></a>&nbsp;<a href="https://github.com/puppywang/easyeda-copycat" target="_blank"><img src="https://img.shields.io/github/repo-size/puppywang/easyeda-copycat" alt="GitHub Repo Size" /></a>&nbsp;<a href="https://choosealicense.com/licenses/apache-2.0/" target="_blank"><img src="https://img.shields.io/github/license/puppywang/easyeda-copycat" alt="GitHub License" /></a>

> **Note:**  
> This tool helps you capture and restore component placement and connectivity information in JLCPCB EDA & EasyEDA Pro boards, reducing the complexity of maintaining multiple PCB/schematic versions within the same project. However, due to current API limitations, the pin-net restoration feature is still under development (WIP).

## Getting Started (Development)

1. **Clone the repository**

    ```bash
    git clone --depth=1 https://github.com/puppywang/easyeda-copycat.git
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Make your changes…**

4. **Build the extension package**

    ```bash
    npm run build
    ```

5. **Install in JLCPCB EDA Pro**

    Load the generated extension from ./build/dist/ into your JLCPCB EDA Pro environment.

## License

<a href="https://choosealicense.com/licenses/apache-2.0/" style="vertical-align: inherit;" target="_blank"><img src="https://img.shields.io/github/license/puppywang/easyeda-copycat" alt="GitHub License" class="not-medium-zoom-image" style="display: inline; vertical-align: inherit;" /></a>
