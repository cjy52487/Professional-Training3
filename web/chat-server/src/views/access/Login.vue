<template>
  <div class="login-wrap">
    <div
      class="login-window"
      :style="{
        boxShadow: `var(${'--el-box-shadow-dark'})`,
      }"
    >
      <h2 class="login-item">登录</h2>
      <el-form
        :model="loginData"
        label-width="70px"
        class="demo-dynamic"
      >
        <el-form-item
          prop="telephone"
          label="账号"
          :rules="[
            {
              required: true,
              message: '此项为必填项',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="loginData.telephone" />
        </el-form-item>
        <el-form-item
          prop="password"
          label="密码"
          :rules="[
            {
              required: true,
              message: '此项为必填项',
              trigger: 'blur',
            },
          ]"
        >
          <el-input type="password" v-model="loginData.password" />
        </el-form-item>
      </el-form>
      <div class="login-button-container">
        <el-button type="primary" class="login-btn" @click="handleLogin"
          >登录</el-button
        >
      </div>

      <div class="go-register-button-container">
        <button class="go-register-btn" @click="handleRegister">注册</button>
        <button class="go-sms-btn" @click="handleSmsLogin">验证码登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
export default {
  name: "Login",
  setup() {
    const data = reactive({
      loginData: {
        telephone: "",
        password: "",
      },
    });
    const router = useRouter();
    const store = useStore();
    const handleLogin = async () => {
      try {
        if (!data.loginData.telephone || !data.loginData.password) {
          ElMessage.error("请填写完整登录信息。");
          return;
        }
        if (!checkTelephoneValid()) {
          ElMessage.error("请输入有效的手机号码。");
          return;
        }
        console.log(store.state.backendUrl, store.state.wsUrl);
        
        // 临时模拟接口响应 - 用于测试
        const mockResponse = {
          data: {
            code: 200,
            message: "登录成功",
            data: {
              uuid: "mock-user-" + Date.now(),
              user_name: "测试用户",
              telephone: data.loginData.telephone,
              avatar: "https://via.placeholder.com/40x40",
              status: 0, // 0表示正常状态
              email: "test@example.com"
            }
          }
        };
        
        // 注释掉真实接口调用，使用模拟数据
        // const response = await axios.post(
        //   store.state.backendUrl + "/login",
        //   data.loginData
        // );
        
        const response = mockResponse;
        console.log(response);
        if (response.data.code == 200) {
          if (response.data.data.status == 1) {
            ElMessage.error("该账号已被封禁，请联系管理员。");
            return;
          }
          try {
            ElMessage.success(response.data.message);
            if (!response.data.data.avatar.startsWith("http")) {
              response.data.data.avatar =
                store.state.backendUrl + response.data.data.avatar;
            }
            store.commit("setUserInfo", response.data.data);
            // 准备创建websocket连接
            const wsUrl =
              store.state.wsUrl + "/wss?client_id=" + response.data.data.uuid;
            console.log(wsUrl);
            store.state.socket = new WebSocket(wsUrl);
            store.state.socket.onopen = () => {
              console.log("WebSocket连接已打开");
            };
            store.state.socket.onmessage = (message) => {
              console.log("收到消息：", message.data);
            };
            store.state.socket.onclose = () => {
              console.log("WebSocket连接已关闭");
            };
            store.state.socket.onerror = () => {
              console.log("WebSocket连接发生错误");
            };
            router.push("/chat/sessionList");
          } catch (error) {
            console.log(error);
          }
        } else {
          ElMessage.error(response.data.message);
        }
      } catch (error) {
        ElMessage.error(error);
      }
    };
    const checkTelephoneValid = () => {
      const regex = /^1[3456789]\d{9}$/;
      return regex.test(data.loginData.telephone);
    };
    const handleRegister = () => {
      router.push("/register");
    };
    const handleSmsLogin = () => {
      router.push("/smsLogin");
    };

    return {
      ...toRefs(data),
      router,
      handleLogin,
      handleRegister,
      handleSmsLogin,
    };
  },
};
</script>

<style>
.login-wrap {
  height: 100vh;
  background-image: url("@/assets/img/chat_server_background.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-window {
  width: 400px;
  background-color: rgb(255, 255, 255, 0.7);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 30px 50px;
  border-radius: 20px;
  /*opacity: 0.7;*/
}

.login-item {
  text-align: center;
  margin-bottom: 20px;
  color: #494949;
}

.login-button-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  margin-top: 20px; /* 可选，根据需要调整按钮与输入框之间的间距 */
  width: 100%;
}

.login-btn,
.login-btn:hover {
  background-color: rgb(237, 194, 243);
  /* background-color: var(--global-color); */
  border: none;
  color: #ffffff;
  font-weight: bold;
}

.go-register-button-container {
  display: flex;
  flex-direction: row-reverse;
  margin-top: 10px;
}

.go-register-btn,
.go-sms-btn {
  background-color: rgba(255, 255, 255, 0);
  border: none;
  cursor: pointer;
  /* color: #d65b54; */
  color:var(--global-color);
  font-weight: bold;
  text-decoration: underline;
  text-underline-offset: 0.2em;
  margin-left: 10px;
}

.el-alert {
  margin-top: 20px;
}
</style>