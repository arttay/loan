FROM node:7.9

RUN useradd --user-group --create-home --shell /bin/false parser
ENV HOME=/home/loan

RUN mkdir -p /home/loan
RUN chown -R parser:parser $HOME

ENV APP_HOME=$HOME


WORKDIR $APP_HOME

RUN apt-get clean

COPY package.json  $APP_HOME/
USER parser

RUN npm cache clean && \
	npm install --progress=false

COPY . $APP_HOME


CMD ["npm", "run"]