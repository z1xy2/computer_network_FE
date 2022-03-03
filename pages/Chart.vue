<template>
  <el-container style="height: 700px">
    <el-aside>
      <el-menu
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        default-active="1"
        style="height: 100%"
      >
        <!-- <ul>
      <li v-for="(item, index) in userList" :key="index">
        <p>
          <span>{{ item }}</span>
        </p>
      </li>
    </ul> -->
        <h1 align="center" style="color: #fff; font-size: 25px">
          欢迎来到聊天室
        </h1>
        <el-menu-item v-for="(item, index) in userList" :key="index" >
          <i class="el-icon-user"></i>
          <span style="display: inline-block">{{ item }}</span>
          <el-checkbox v-model="checkList[index]"
            ><span style="color: white">选择</span></el-checkbox
          >
        </el-menu-item>
        <div style="text-align:center; position:absolute; bottom:10px; width:100%;">
          <el-button type="primary" icon="el-icon-circle-plus" @click=selectAll></el-button>
          <el-button type="primary" icon="el-icon-delete" @click=clearAll></el-button>
        </div> </el-menu
    ></el-aside>
    <el-container>
      <el-main style="background-color: #d3dce6">
        <div v-for="(item, index) in msgList" :key="index">
          <p>
            <span>用户: {{ item.id }}</span>
            <span
              style="display: inline-block; margin-left: 100px; font-size: 10px"
              >{{ item.time }}</span
            >
          </p>
          <div class="chatText">
            <p>{{ item.text }}</p>
          </div>
        </div>
      </el-main>
      <el-footer style="height: auto; background-color: #e9eef3">
        <div id="footer" style="overflow: inherit">
          <div style="margin-top: 5px ;position:relative">
            <span>用户id:{{ id }}</span>
             <el-button
              type="primary"
              @click="ssendMsg"
              style="margin-left: 850px; width: 100px; margin-top: 0px ;"
              >选择发送</el-button
            >
            <el-button
              type="primary"
              @click="sendMsg"
              style="margin-left: 10px; width: 100px; margin-top: 0px ;position:absolute; right:10px"
              >发送</el-button
            >
          </div>
          <el-input
            v-model="msg"
            placeholder="请输入内容"
            :rows="4"
            type="textarea"
            style="margin-top: 5px"
          ></el-input>
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import Vue from "vue";
export default {
  name: "Chart",
  data() {
    return {
      msg: "",
      id: "",
      msgList: [],
      userList: [],
      checkList: new Array(100).fill(false),
    };
  },
  mounted() {
    this.id = localStorage.getItem("id");
    console.log(this.id, "entered chart");
    if (!this.id) {
      this.$router.push("/");
    }
    Vue.prototype.$data1 = this.data;
    this.initWebSocket();
    // ws.addEventListener("open", this.handleWsOpen.bind(this), false);
    // ws.addEventListener("close", this.handleWsClose.bind(this), false);
    // ws.addEventListener("error", this.handleWsError.bind(this), false);
    // ws.addEventListener("message", this.handleWsMessage.bind(this), false);
  },
  methods: {
    ssendMsg(){
      const msg = this.msg.trim();
      if (!msg.length) {
        return;
      }
      //指定用户发送code、250
      let textmsg = {
        code: 250,
        msg: {
          id: this.id,
          text: msg,
          time: new Date().toString(),
          seleUser:this.seleUser
        },
      };   
      console.log('textmsg',textmsg)  
      this.sendWebSocketMsg(textmsg); 
    },
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
          time: new Date().toString(),
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
      let response = e.data; //取到回应
      //不知道什么原因得到的是字符串,这才取到真正response
      response = JSON.parse(response);
      console.log("handleWsMessage收到了消息", response);
      //请求100更新用户列表
      if (response.code == 100) {
        console.log("有人进入房间");
        this.userList = response["userList"];
      } else if (response.code == 101) {
        console.log("有人离开房间");
        this.userList = response["userList"];
      } else if (response.code == 200) {
        console.log("有人群发消息");
        this.msgList.push(response["msg"]);
      }
    },
    selectAll(){
      this.checkList=new Array(100).fill(true)
    },
    clearAll(){
      this.checkList=new Array(100).fill(false)
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
  computed:{
    seleUser(){
      console.log('计算seleUser')
      var seleUser=[]
      for(var i=0;i<this.userList.length;i++){
        if (this.checkList[i]){
          console.log('push')
          seleUser.push(this.userList[i])
        }        
      }
      return seleUser
    }
  }
};
</script>

<style scoped>
.el-input {
  margin-top: 10px;
}
.chatText {
  border-radius: 4px;
  background-color: #c6e2ff;
  display: inline-block;
  padding: 0px 5px;
}

.chatText > p {
  margin: 12px;
}
.el-checkbox {
  float: right;
  margin-left: 100px;
}
.el-menu{
  position:relative;
}
.el-menu{
  position:relative;
}
</style> 