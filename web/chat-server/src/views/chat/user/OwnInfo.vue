<template>
  <div class="chat-wrap">
    <div
      class="chat-window"
      :style="{
        boxShadow: `var(--el-box-shadow-dark)`,
      }"
    >
      <el-container class="chat-window-container">
        <el-aside class="aside-container">
          <NavigationModal></NavigationModal>
          <ContactListModal></ContactListModal>
        </el-aside>

        <div class="owner-info-window">
          <div class="my-homepage-title"><h2>我的主页</h2></div>

          <div class="item-row">
            <p class="owner-prefix">用户id：</p>
            <p>{{ userInfo.uuid }}</p>
          </div>

          <div class="item-row">
            <p class="owner-prefix">昵称：</p>
            <p>{{ userInfo.nickname }}</p>
          </div>

          <div class="item-row">
            <p class="owner-prefix">电话：</p>
            <p>{{ userInfo.telephone }}</p>
          </div>

          <div class="item-row">
            <p class="owner-prefix">邮箱：</p>
            <p>{{ userInfo.email }}</p>
          </div>

          <div class="item-row">
            <p class="owner-prefix">性别：</p>
            <p>
              {{
                userInfo.gender === 0
                  ? "男"
                  : userInfo.gender === 1
                  ? "女"
                  : "未设置"
              }}
            </p>
          </div>

          <div class="item-row">
            <p class="owner-prefix">生日：</p>
            <p>{{ userInfo.birthday }}</p>
          </div>

          <div class="item-row">
            <p class="owner-prefix">个性签名：</p>
            <p>{{ userInfo.signature }}</p>
          </div>

          <div class="item-row">
            <p class="owner-prefix">加入ComeChat的时间：</p>
            <p>{{ userInfo.created_at }}</p>
          </div>

          <div class="owner-opt item-row">
            <p class="owner-prefix" style="margin-right: 10px;">头像：</p>
            <img
              style="width: 40px; height: 40px; border-radius: 4px"
              :src="userInfo.avatar || defaultAvatar"
              alt="头像"
              @error="handleImgError"
            />
          </div>
        </div>

        <div class="edit-window">
          <el-button class="edit-btn" @click="showMyInfoModal">编辑</el-button>
        </div>

        <Modal :isVisible="isMyInfoModalVisible">
          <template v-slot:header>
            <div class="modal-header">
              <div class="modal-quit-btn-container">
                <button class="modal-quit-btn" @click="quitMyInfoModal">
                  <el-icon><Close /></el-icon>
                </button>
              </div>
              <div class="modal-header-title">
                <h3>修改主页</h3>
              </div>
            </div>
          </template>
          <template v-slot:body>
            <el-scrollbar
              max-height="300px"
              style="
                width: 400px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 20px;
              "
            >
              <div class="modal-body">
                <el-form ref="formRef" :model="updateInfo" label-width="70px">
                  <el-form-item
                    prop="nickname"
                    label="昵称"
                    :rules="[
                      {
                        min: 3,
                        max: 10,
                        message: '昵称长度在 3 到 10 个字符',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input v-model="updateInfo.nickname" placeholder="选填" />
                  </el-form-item>
                  <el-form-item prop="email" label="邮箱">
                    <el-input v-model="updateInfo.email" placeholder="选填" />
                  </el-form-item>
                  <el-form-item prop="birthday" label="生日">
                    <el-input v-model="updateInfo.birthday" placeholder="选填，格式为2024.1.1" />
                  </el-form-item>
                  <el-form-item prop="signature" label="个性签名">
                    <el-input v-model="updateInfo.signature" placeholder="选填" />
                  </el-form-item>
                  <el-form-item prop="avatar" label="头像">
                    <el-upload
                      v-model:file-list="fileList"
                      ref="uploadRef"
                      :auto-upload="false"
                      :action="uploadPath"
                      :on-success="handleUploadSuccess"
                      :before-upload="beforeFileUpload"
                    >
                      <template #trigger>
                        <el-button style="background-color: rgb(252, 210, 210)">上传图片</el-button>
                      </template>
                    </el-upload>
                  </el-form-item>
                </el-form>
              </div>
            </el-scrollbar>
          </template>
          <template v-slot:footer>
            <div class="modal-footer">
              <el-button class="modal-close-btn" @click="closeMyInfoModal">
                完成
              </el-button>
            </div>
          </template>
        </Modal>
      </el-container>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Modal from "@/components/Modal.vue";
import NavigationModal from "@/components/NavigationModal.vue";
import ContactListModal from "@/components/ContactListModal.vue";
import defaultAvatar from "@/assets/default-avatar.png";
import { Close } from "@element-plus/icons-vue";

export default {
  name: "OwnInfo",
  components: {
    Modal,
    ContactListModal,
    NavigationModal,
    Close,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const userInfo = reactive(store.state.userInfo);

    // 编辑表单数据
    const updateInfo = reactive({
      nickname: userInfo.nickname || "",
      email: userInfo.email || "",
      birthday: userInfo.birthday || "",
      signature: userInfo.signature || "",
      avatar: userInfo.avatar || "",
    });

    // 弹窗显示状态
    const isMyInfoModalVisible = ref(false);

    // 上传文件列表
    const fileList = ref([]);

    // 上传接口地址（示例）
    const uploadPath = "/api/upload";

    // 打开弹窗时同步数据
    function showMyInfoModal() {
      isMyInfoModalVisible.value = true;
      Object.assign(updateInfo, userInfo);
      fileList.value = [];
    }

    // 关闭弹窗（完成）
    function closeMyInfoModal() {
      // TODO: 这里可以调用接口，提交修改的数据
      // 提交后同步 userInfo
      Object.assign(userInfo, updateInfo);
      isMyInfoModalVisible.value = false;
    }

    // 点击弹窗右上角关闭
    function quitMyInfoModal() {
      isMyInfoModalVisible.value = false;
    }

    // 图片加载失败，替换默认头像
    function handleImgError(event) {
      event.target.src = defaultAvatar;
    }

    // 上传成功回调
    function handleUploadSuccess(response, file, fileListArg) {
      console.log("上传成功", response);
      // 这里可以根据接口返回，更新 updateInfo.avatar
      // 示例:
      // updateInfo.avatar = response.url;
    }

    // 上传前校验文件类型
    function beforeFileUpload(file) {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        alert("只能上传图片文件");
      }
      return isImage;
    }

    return {
      router,
      userInfo,
      updateInfo,
      isMyInfoModalVisible,
      fileList,
      uploadPath,
      showMyInfoModal,
      closeMyInfoModal,
      quitMyInfoModal,
      handleImgError,
      handleUploadSuccess,
      beforeFileUpload,
    };
  },
};
</script>

<style scoped>
.owner-info-window {
  width: 84%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 10px;
  font-size: 13px;
  color: #333;
}
.my-homepage-title {
  text-align: center;
  width: 100%;
}

.my-homepage-title h2 {
  margin-bottom: 20px;
  font-family: Arial, Helvetica, sans-serif;
}

.item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 12px;
  background-color: #fff;
  box-sizing: border-box;
}

.owner-prefix {
  min-width: 140px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 450;
  color: #333;
}

.owner-opt {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.edit-btn {
  height: 36px;
  line-height: 40px;
  font-size: 14px;
  padding: 0 17px;
}

.edit-window {
  width: 10%;
  display: flex;
  flex-direction: column-reverse;
}
</style>
