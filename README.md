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

**Note:** To run the service you need to establish a series of environment variables to which the service depends, prior to running the **npm start** command.

**Linux/Mac OSX**

```

export AZURE_STORAGE_HOST= {AZURE STORAGE HOST}
export AZURE_STORAGE_SAS= {AZURE TABLE SAS TOKEN}
export AZURE_STORAGE_TABLE= {AZURE TABLE NAME}
export JWT_KEY={JWT KEY}

```

### Building and running docker image ###

To build the docker image and install it to the local docker repo, from the root directory navigate to the docker directory and execute gulp default task.

```

:> cd docker

:> gulp

. . .

```

Follow the prompts. The gulp process can generate either a standard and debug variation of the project.  The only difference being that the debug variation runs the node.js application with the debug setting to allow remote debugging of the service.

**Debug Port: 6000**  

**Note:** the above stated environment variables must be passed onto the docker container via the **docker run** command

```

:> docker run -p 8000:8000 -d -e AZURE_STORAGE_HOST -e AZURE_STORAGE_SAS -e AZURE_STORAGE_TABLE -e JWT_KEY upmc-isd-eti/esb-code-set-api

```
