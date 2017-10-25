# nawqa-decadal-v2

## Developer Instructions

![WiM](wimlogo.png)


# nawqa-decadal-v2

This mapper shows how concentrations of pesticides, nutrients, metals, and organic contaminants in groundwater are changing during decadal periods across the Nation.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

NPM, Gulp, bower

### Installing

1. Clone the repo
2. `cd` into the folder, if you already have installed gulp then run `npm install` AND `bower install`
	i. If you do not have gulp installed: run `npm install -g gulp` to install Gulp globally, then run `npm install gulp`
3. run `gulp watch` to run in browser with watch for debugging.
4. run `gulp build` before commit to build project.

NOTE: You MUST run the gulp build before committing and pushing to repo

## Deployment

Deploy to S3 using Cloudberry or similar program. Only copy the contents of the "Build" folder.

## Built With

* [Angular](https://angular.io/) - The main web framework used
* [Clarity UI](https://vmware.github.io/clarity/) - Top-level UI framework if you have one 
* [NPM](https://www.npmjs.com/) - Dependency Management
* [Others](https://www.npmjs.com/) - Any other high-level dependencies

## Contributing

Please read [CONTRIBUTING.md]() for details on the process for submitting pull requests to us. Please read [CODE_OF_CONDUCT.md]() for details on adhering by the [USGS Code of Scientific Conduct](https://www2.usgs.gov/fsp/fsp_code_of_scientific_conduct.asp).

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

Advance the version when adding features, fixing bugs or making minor enhancement. Follow semver principles. To add tag in git, type git tag v{major}.{minor}.{patch}. Example: git tag v2.0.5

To push tags to remote origin: `git push origin --tags`

*Note that your alias for the remote origin may differ.

## Authors

* **Nick Estes**  - *Lead Developer* - [USGS Web Informatics & Mapping](https://wim.usgs.gov/)
* **Jessie Smith** - *Developer* -  [USGS Web Informatics & Mapping](https://wim.usgs.gov/)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the Creative Commons CC0 1.0 Universal License - see the [LICENSE.md](LICENSE.md) file for details

## Citation
In the spirit of open source, please cite any re-use of the source code stored in this repository. Below is the suggested citation:

`This project contains code produced by the Web Informatics and Mapping (WIM) team at the United States Geological Survey (USGS). As a work of the United States Government, this project is in the public domain within the United States. https://wim.usgs.gov`



## About WIM
* This project authored by the [USGS WIM team](https://wim.usgs.gov)
* WIM is a team of developers and technologists who build and manage tools, software, web services, and databases to support USGS science and other federal government cooperators.
* WiM is a part of the [Upper Midwest Water Science Center](https://www.usgs.gov/centers/wisconsin-water-science-center).