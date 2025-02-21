<template>
  <div id="register">
    <a-form
      class="register-form"
      :model="formState"
      @submit="login"
      auto-label-width
      label-align="left"
      :rules="checkRules"
    >
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item label="密码" name="password">
        <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px"
          >登录
        </a-button>
        <span style="margin-left: 20px">没有账号？</span>
        <router-link to="/user/register">注册</router-link>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const formState = ref({
  username: "",
  password: "",
});

const checkRules = {
  username: [{ required: true, message: "请输入用户名!" }],
  password: [{ required: true, message: "请输入密码!" }],
};

const login = () => {
  console.log(formState);
};
</script>

<style scoped>
.register-form {
  margin: auto;
  max-width: 480px;
}
</style>
