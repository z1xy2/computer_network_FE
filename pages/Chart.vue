<template>
  <el-main>
    <p>Chart</p>
    <p>用户id:{{ id }}</p>
    <el-input v-model="msg" placeholder="请输入内容"></el-input>
    <el-button type="primary" @click="sendMsg">发送</el-button>
    <ul>
      <li v-for="(item,index) in msgList" :key="index">
        <p>
          <span>{{ item.id }}</span>
          <span>{{ item.time }}</span>
        </p>
        <p>消息:{{ item.text }}</p>
      </li>
    </ul>
    <ul>
      <li v-for="(item,index) in userList" :key="index">
        <p>
          <span>{{ item }}</span>
        </p>
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
      userList: [],
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
      const msg = this.msg.trim();
      if (!msg.length) {
        return;
      }
      //群发code200
      let textmsg = {
        code: 200,
        msg: {
          id: this.id,
          text: msg,
          time:new Date().toString(),
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
      console.log(this);
    },
    sendWebSocketMsg(event) {
      this.websock.send(JSON.stringify(event));
    },
    //应该是连接打开后执行
    handleWsOpen(e) {
      console.log("handleWsOpen调用", e);
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
      console.log("handleWsError收到错误", e);
    },
    handleWsMessage(e) {
      console.log("handleWsMessage收到的event", e);
      let response = e.data;//取到回应
      //不知道什么原因得到的是字符串,这才取到真正response
      response=JSON.parse(response);
      console.log("handleWsMessage收到了消息",response);
      //请求100更新用户列表
      if (response.code == 100) {
        console.log("有人进入房间");
        this.userList=response['userList']
      }else if (response.code == 101) {
        console.log("有人离开房间");
        this.userList=response['userList']
      }else if (response.code == 200) {
        console.log("有人群发消息");
        this.msgList.push(response['msg'])
      }
    },
  },
  beforeDestroy() {
    console.log("该vc被销毁了");
    //请求更新用户列表去除一个用户
      let leaveroom = {
        code: 101,
        msg: this.id,
      };
    this.sendWebSocketMsg(leaveroom);
    //断开连接
    this.websock.close();
  },
};
</script>

<style>
</style>