# Hardening de Containers

## Diagnóstico - Problemas encontrados

1. Para uma aplicação que apenas executa o Node.js, utilizar a imagem completa ubuntu:latest não é necessário, pois ela possui vários programas, arquivos e serviços que não serão utilizados pela aplicação, gerando um excedente de tamanho do container, além de aumentar a superfície de ataques.

2. No Dockerfile, utiliza-se a imagem ubuntu:latest ao invés de uma versão específica, o que quer dizer que a aplicação sempre será executada na versão mais recente do ubuntu, o que dificulta a rastreabilidade de incidentes, quebra a imutabilidade e introduz novas falhas de segurança das versões mais novas.

3. No diretório do app, o arquivo package.json está vazio, não é um json válido e não há informações sobre os pacotes a serem instalandos. Isso prejudica as decisões de segurança, pois não se sabe quais pacotes devem ser usados. Ainda nesse diretório, o arquivo server.js não executa um servidor web e nem expõe alguma porta, o que prejudica o funcionamento correto do servidor.

4. No Dockerfile, o usuário que executa a aplicação é o root. Isso permite que, se algum usuário ou agente malicioso tiver acesso ao container, ele terá todos os privilégios de adminsitrador para executar qualquer ação de no container, o que implica em uma superfície de ataque maior e controle do container.

5. No docker-compose.yml, As portas 3000 do aplicativo e 3306 do banco mysql estão acessíveis externamente. A exposição da porta do aplicativo é necessária para ser acessada através do navegador no host, mas a do banco desnecessária, pois o banco só deve se comunicar apenas com o aplicativo e não expor sua porta ao host também, aumentando a superfície de ataque.

6. No docker-compose.yml, o banco de dados não tem uma versão específica, o que prejudica a rastreabilidade de incidentes, quebra a imutabilidade, introduz novas falhas de segurança das versões mais novas e maior risco de incompaptibilidade com a aplicação e corrompimento de dados.

7. No Dockerfile, a senha de acesso de usuário ao banco é exposta através da variável de ambiente DB_PASSWORD. Já no docker-compose.yml, a senha de acesso root ao banco de dados é exposta através da variável de ambiente MYSQL_ROOT_PASSWORD. Isso representa um grave risco de segurança e o vazamento de dados sensíveis, pois as senhas estão visíveis no código fonte para qualquer usuário que tiver acesso a esse código ver.

8. No docker-compose.yml, não existe limite de utilização de CPU e memória, o que pode ocasionar esgotamento de memória e de CPU, através de um ataque por exemplo, prejudicando o funcionamento da aplicação e causando encerramento de processos de outros containers e até do próprio Docker.

## Medidas Aplicadas

**Alteração da imagem base para uma mais enxuta com apenas itens necessários para a aplicação e versão específica**

- **O que foi modificado:** imagem base de ubuntu:latest para node:24.21.0-alpine; remoção da instalação dos pacotes nodejs e npm no Dockerfile; imagem do mysql de mysql:latest para mysql:8.4 no docker-compose.yml
- **Objetivo de segurança:** reduzir a superfície de ataque
- **Risco reduzido:** vulnerabilidades em programas, arquivos e serviços não utilizados

**Alteração do usuário que está executando a aplicação**

- **O que foi modificado:** execução da aplicação com o usuário node ao invés do root; copiar arquivos do app para o container como usuário node e grupo node
- **Objetivo de segurança:** princípio do menor privilégio, caso o container seja invadido, o invasor não terá privilégios de administrador
- **Risco reduzido:** utilizar o container invadido como meio para obter informações em volumes, atacar outros containers e o host

**Remoção de senhas inseridas no código**

- **O que foi modificado:** remoção de senhas hardcoded no Dockerfile e docker-compose.yml; criação do arquivo .env para ser usado no docker-compose.yml através da environment; uso da interpolação para inserir o valor das variáveis de ambiente no docker-compose.yml; criação do .gitignore para evitar que o .env seja enviado ao repositório; criação do .env.example para listar as variáveis de ambiente que o projeto precisa, mas sem dados reais
- **Objetivo de segurança:** impedir a exposição de senhas e dados sensíveis no código.
- **Risco reduzido:** acesso não autorizado a sistemas e dados

**Remoção de acesso a serviços que não precisam estar acessíveis externamente**

- **O que foi modificado:** remoção da chave ports no service "banco" no docker-compose.yml
- **Objetivo de segurança:** evitar expor o banco de dados às requisições externas, aplicando o princípio do menor privilégio de rede
- **Risco reduzido:** superfície de ataque, exposição acidental na internet, vazamento de dados sensíveis

**Limitação de recursos por containers**

- **O que foi modificado:** adição de limites de recursos de CPU e RAM para cada serviço (app e banco)
- **Objetivo de segurança:** conter falhas de código, mitigar ataques de negação de serviço (DoS), evitar o consumo exagerado de recursos prejudicando toda a arquitetura
- **Risco reduzido:** negação de serviço, propagação de falhas para outros containers, vazamento de memória, loops infinitos, uso exagerado dos recursos em caso de uma invasão

## Análise Final

1. **Qual era o principal risco encontrado no projeto?**

2. **Qual alteração de hardening foi mais importante? Por quê?**

3. **O que poderia acontecer caso o container da aplicação fosse comprometido?**

4. **Como o princípio do menor privilégio foi aplicado?**

5. **Por que o .env não deve ser enviado para o repositório?**

6. **Qual é a função do .env.example?**

7. **Como o projeto poderia receber novas verificações de segurança automaticamente em uma pipeline CI/CD?**

8. **Quais medidas adicionais poderiam ser aplicadas caso essa aplicação fosse executada em Kubernetes?**
