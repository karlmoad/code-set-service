# code-set-service
UPMC ESB Code Set Service used to populate ESB global cache and manage baseline data



### Prerequisites

- Node.js & NPM package manager:     [https://nodejs.org]
- Docker:     [https://www.docker.com] Optional
- Gulp:     [http://gulpjs.com]
- Yeoman:     [http://yeoman.io]
- Swaggerize Tools:     [https://github.com/krakenjs/generator-swaggerize]


```

:> npm install -g gulp
:> npm install -g yo
:> npm install -g generator-swaggerize

```


### Running the service locally

after cloning the repository within the src/code-set-service directory

```

:> npm install

. . .

:> npm start

```

**Note:** To run the service you need to establish a series of environmental variables to which the service depends, prior to running the **npm start** command.

**Linux/Mac OSX**

```

export AZURE_STORAGE_HOST= {AZURE STORAGE HOST}
export AZURE_STORAGE_SAS= {AZURE TABLE SAS TOKEN}
export AZURE_STORAGE_TABLE= {AZURE TABLE NAME}
export JWT_KEY={JWT KEY}

```

### Building and running docker image ###

To build the docker image and install it to the local docker repo, form the root directory naviagte to the docker directory and execute gulp default task.

```

:> cd docker

:> gulp

. . .

```

Follow the prompts. The gulp process can generate either a standard and debug variation of the project.  The only difference being that the debug variation runs the node.js application with he debug setting to allow remote debugging of the service.

**Debug Port: 6000**   
