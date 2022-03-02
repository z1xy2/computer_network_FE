<template>
  <el-main>
    <p>Chart</p>
    <p>用户id:{{ id }}</p>
    <el-input v-model="msg" placeholder="请输入内容"></el-input>
    <el-button type="primary" @click="sendMsg">发送</el-button>
    <ul>
      <li v-for="item in msgList" :key="item.Msgid">
        <p>
          <span>{{ item.userId }}</span>
          <span>{{ new Date(item.dataTime) }}</span>
        </p>
        <p>消息:{{ item.msg }}</p>
      </li>
    </ul>
  </el-main>
</template>

<script>
export default {
  name: "Chart",
  data() {
    return {
      msg: "",
      id: "",
      msgList: [],
    };
  },
  mounted() {
    this.id = localStorage.getItem("id");
    console.log(this.id, "entered chart");
    if (!this.id) {
      this.$router.push("/");
    }
    this.initWebSocket();
    // ws.addEventListener("open", this.handleWsOpen.bind(this), false);
    // ws.addEventListener("close", this.handleWsClose.bind(this), false);
    // ws.addEventListener("error", this.handleWsError.bind(this), false);
    // ws.addEventListener("message", this.handleWsMessage.bind(this), false);
  },
  methods: {
    sendMsg() {
      const msg = this.msg;
      if (!msg.trim().length) {
        return;
      }
      let textmsg = {
        code: 200,
        msg: {
          id: this.id,
          text: this.msg,
        },
      };
      this.sendWebSocketMsg(textmsg);
      console.log("send msg", this.msg);
    },
    initWebSocket() {
      this.websock = new WebSocket("ws://127.0.0.1:8000/chart-channel/");
      this.websock.onmessage = this.handleWsMessage;
      this.websock.onopen = this.handleWsOpen;
      this.websock.onerror = this.handleWsError;
      this.websock.onclose = this.handleWsClose;
        console.log(this)      
    },
    sendWebSocketMsg(msg) {
      this.websock.send(JSON.stringify(msg));
    },
    handleWsOpen(e) {
      console.log('handleWsOpen调用', e);
      let enterroom = {
        code: 100,
        msg: this.id,
      };
      this.sendWebSocketMsg(enterroom);
    },
    handleWsClose(e) {
      console.log("断开连接", e.code, " ", e.reason, " ", e.wasClean);
    },
    handleWsError(e) {
      console.log(3, e);
    },
    handleWsMessage(e) {
      let message = JSON.parse(e.data);
      console.log("handleWsMessage收到了消息", message);
      if (message.code == 100) {
        console.log("进入房间");
      }
    },
  },
  beforeDestroy() {
    console.log("该vc被销毁了");
    this.websock.close();
  },
};
</script>

<style>
</style>