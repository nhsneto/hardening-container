# Avaliação - Segurança de Containers

## Análise

1. Para uma aplicação que apenas executa o Node.js, utilizar a imagem completa ubuntu:latest não é necessário, pois ela possui vários programas, arquivos e serviços que não serão utilizados pela aplicação, gerando um excedente de tamanho em bytes, além de aumentar a superfície de ataques.

2. A configuração utiliza a imagem ubuntu:latest ao invés de uma versão específica, o que quer dizer que a aplicação sempre será executada na versão mais recente do ubuntu, o que dificulta a rastreabilidade de incidentes, quebra a imutabilidade e introduz novas falhas de segurança das versões mais novas.

3. O Dockerfile expõe a senha do banco de dados, o que representa um grave risco de segurança e o comprometimento de dados sensíveis.

4. 
