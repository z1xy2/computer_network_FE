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
        <el-menu-item v-for="(item, index) in userList" :key="index">
          <i class="el-icon-user"></i>
          <span style="display: inline-block">{{ item }}</span>
          <el-checkbox v-model="checkList[index]"
            ><span style="color: white">选择</span></el-checkbox
          >
        </el-menu-item>
        <div
          style="
            text-align: center;
            position: absolute;
            bottom: 10px;
            width: 100%;
          "
        >
          <el-button
            type="primary"
            icon="el-icon-circle-plus"
            @click="selectAll"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-delete"
            @click="clearAll"
          ></el-button>
        </div> </el-menu
    ></el-aside>
    <el-container>
      <el-main style="background-color: #d3dce6; height: 512px">
        <div v-for="(item, index) in msgList" :key="index">
          <p>
            <span>用户: {{ item.id }}</span>
            <span
              style="display: inline-block; margin-left: 100px; font-size: 10px"
              >{{ item.time }}</span
            >
          </p>
          <div class="chatText">
            <el-image
              v-if="item.text.indexOf('data:image/jpeg;base64') != -1"
              style="width: auto; height: 100px"
              :src="item.text"
              :preview-src-list="[item.text]"
            >
            </el-image>
            <p v-else-if="item.text.indexOf('http') == -1">
              {{ item.text }}
            </p>
            <p v-else>
              文件: {{ item.fileName }}
              <span
                ><i class="el-icon-download" @click="download(item.text)"></i
              ></span>
            </p>
          </div>
        </div>
      </el-main>
      <el-footer style="height: 230px; background-color: #e9eef3">
        <div id="footer" style="overflow: inherit">
          <div class="options">
            <span>用户id:{{ id }}</span>
            <el-radio-group v-model="options" style="margin-left: 100px">
              <el-radio-button label="text">输入文字</el-radio-button>
              <el-radio-button label="image">输入图片</el-radio-button>
              <el-radio-button label="file">输入文件</el-radio-button>
            </el-radio-group>
            <el-button
              type="primary"
              @click="ssendMsg"
              style="margin-left: 300px; width: 100px; margin-top: 0px"
              >选择发送</el-button
            >
            <el-button
              type="primary"
              @click="sendVedio"
              style="margin-left: 50px; width: 100px; margin-top: 0px"
              >发起视频</el-button
            >
            <el-button
              type="primary"
              @click="sendMsg"
              style="
                margin-left: 10px;
                width: 100px;
                margin-top: 0px;
                position: absolute;
                right: 10px;
              "
              >发送</el-button
            >
          </div>
          <el-input
            v-if="options == 'text'"
            v-model="msg"
            placeholder="请输入内容"
            :rows="6"
            type="textarea"
            style="margin-top: 5px"
          ></el-input>
          <el-upload
            action=""
            :on-change="getImgFile"
            :limit="1"
            list-type="picture"
            :auto-upload="false"
            v-if="options == 'image'"
          >
            <el-button size="small" type="primary" style="margin-top: 10px"
              >选择图片上传,最多上传一张图片</el-button
            >
          </el-upload>
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            v-if="options == 'file'"
            :limit="1"
            :auto-upload="false"
            :on-change="getBigFile"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">请选择文件</div>
          </el-upload>
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
      options: "text",
      msg: "",
      id: "",
      msgList: [],
      userList: [],
      file: "",
      checkList: new Array(100).fill(false),
      receiveFile: "",
      chunkListL: [],
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
    sendVedio() {
      var request = {
        code: 600,
      };
      this.sendWebSocketMsg(request);
      window.open("http://127.0.0.1:8081/p2p?type=offer");
    },
    download(text) {
      window.open(text);
    },
    getBigFile(file) {
      this.file = file;
      console.log(file);
    },
    ssendMsg() {
      if (this.options == "text") {
        const msg = this.msg.trim();
        if (!msg.length) {
          return;
        }
        //指定用户发送文本code为250
        let textmsg = {
          code: 250,
          msg: {
            id: this.id,
            text: msg,
            time: new Date().toString(),
            seleUser: this.seleUser,
          },
        };
        console.log("textmsg", textmsg);
        this.sendWebSocketMsg(textmsg);
      } else if (this.options == "image") {
        //为图片也是发送base64的文本且操作和文字相同所以也是250
        let textmsg = {
          code: 250,
          msg: {
            id: this.id,
            text: this.image,
            time: new Date().toString(),
            seleUser: this.seleUser,
          },
        };
        this.sendWebSocketMsg(textmsg);
        console.log("send msg", this.msg);
      } else {
        //文件发送的虽然也是文本但要另操作
        const blob = this.file.raw;
        console.log(blob);
        //后面改为40960
        const bytesPerPiece = 409600;
        const totalSize = blob.size;
        let start = 0;
        let end;
        var count = 0;
        var time = new Date().toString();
        var fileName = blob.name;
        while (start < blob.size) {
          end = start + bytesPerPiece;
          if (end > blob.size) {
            end = blob.size;
          }
          // 切割文件
          var chunk = blob.slice(start, end);
          //getvase是异步函数，造成了还未赋值完就执行了后面的操作，导致结果出错，并非chunk作用域的问题,详情见收藏夹!
          //时间回调函数和promise中的then后面的函数都是异步的，写代码需要特别小心
          this.getBase64(chunk).then((res) => {
            console.log(res);
            // 发送数据到服务器
            this.sendWebSocketMsg({
              code: 350,
              msg: {
                id: this.id,
                time: time,
                chunk: res,
                count: count,
                len: Math.ceil(totalSize / bytesPerPiece),
                fileName: fileName,
                seleUser: this.seleUser,
              },
            });
            count++;
          });
          start = end;
        }
        // 表示发送完毕
        console.log("同步已执行完成");
      }
    },
    sendMsg() {
      //如果为文本
      if (this.options == "text") {
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
      } else if (this.options == "image") {
        //为图片
        let textmsg = {
          code: 200,
          msg: {
            id: this.id,
            text: this.image,
            time: new Date().toString(),
          },
        };
        this.sendWebSocketMsg(textmsg);
        console.log("send msg", this.msg);
      } else if (this.options == "file") {
        const blob = this.file.raw;
        console.log(blob);
        //后面改为40960
        const bytesPerPiece = 409600;
        const totalSize = blob.size;
        let start = 0;
        let end;
        var count = 0;
        var time = new Date().toString();
        var fileName = blob.name;
        while (start < blob.size) {
          end = start + bytesPerPiece;
          if (end > blob.size) {
            end = blob.size;
          }
          // 切割文件
          var chunk = blob.slice(start, end);
          //getvase是异步函数，造成了还未赋值完就执行了后面的操作，导致结果出错，并非chunk作用域的问题,详情见收藏夹!
          //时间回调函数和promise中的then后面的函数都是异步的，写代码需要特别小心
          this.getBase64(chunk).then((res) => {
            console.log(res);
            // 发送数据到服务器
            this.sendWebSocketMsg({
              code: 300,
              msg: {
                id: this.id,
                time: time,
                chunk: res,
                count: count,
                len: Math.ceil(totalSize / bytesPerPiece),
                fileName: fileName,
              },
            });
            count++;
          });
          start = end;
        }
        // 表示发送完毕
        console.log("同步已执行完成");
      }
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
      } else if (response.code == 300) {
        console.log("有人群发文件");
      } else if (response.code == 301) {
        this.msgList.push(response["msg"]);
      } else if (response.code == 600) {
        this.$alert("用户请求视频聊天", {
          confirmButtonText: "确定",
          callback: (action) => {
            if(action=='confirm'){ 
              window.open("http://127.0.0.1:8081/p2p?type=answer");
            }            
          },
        });
      }
    },
    selectAll() {
      this.checkList = new Array(100).fill(true);
    },
    clearAll() {
      this.checkList = new Array(100).fill(false);
    },
    getBase64(file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        let Result = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
          Result = reader.result;
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(Result);
        };
      });
    },

    getImgFile(file) {
      console.log(file);
      this.getBase64(file.raw).then((res) => {
        console.log(res);
        this.image = res;
      });
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
  computed: {
    seleUser() {
      console.log("计算seleUser");
      var seleUser = [];
      for (var i = 0; i < this.userList.length; i++) {
        if (this.checkList[i]) {
          console.log("push");
          seleUser.push(this.userList[i]);
        }
      }
      return seleUser;
    },
  },
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
.el-menu {
  position: relative;
}
.el-menu {
  position: relative;
}
.options {
  margin-top: 5px;
  position: relative;
  display: flex;
}
</style> 