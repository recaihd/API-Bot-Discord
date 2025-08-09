<img src="https://i.postimg.cc/qvTwGH1K/spibsnner.png">

---

# Bot de Notificação de Vídeos do YouTube no Discord

Um bot do Discord que utiliza a **YouTube Data API v3** do <a href="https://console.cloud.google.com/cloud-hub/home;board-filter=type:APP_HUB,key:application_name?inv=1&invt=Ab5Bmg&project=yotubebot-468114&supportedpurview=project" target="_blank">Google Clounds</a> para enviar notificações automáticas quando novos vídeos são publicados em um canal específico do YouTube.  
Inclui **embeds personalizados**, **botão para assistir** e suporte a **Shorts**.

---

## Funcionalidades
- Notifica **imediatamente** quando um vídeo novo é postado.
- Mostra **título, descrição, thumbnail e botão de assistir**.
- Funciona para vídeos normais e **Shorts**.
- Salva o último vídeo notificado para evitar mensagens repetidas.

---

## Dependências

Para rodar este projeto, instale as seguintes bibliotecas no Node.js:

```bash
npm install discord.js
```
```bash
npm install googleapis
```
```bash
npm install dotenv
```
```bash
npm install axios
```

