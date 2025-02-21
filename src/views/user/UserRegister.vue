<template>
  <div id="register">
    <a-form
      class="register-form"
      :model="formState"
      @submit="register"
      auto-label-width
      label-align="left"
      :rules="checkRules"
    >
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item label="昵称" name="nickname">
        <a-input v-model:value="formState.nickname" />
      </a-form-item>

      <a-form-item label="手机号" name="phone">
        <a-input v-model:value="formState.phone" />
      </a-form-item>

      <a-form-item label="性别" name="gender">
        <a-select v-model:value="formState.gender">
          <a-select-option value="male">男</a-select-option>
          <a-select-option value="female">女</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="密码" name="password">
        <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <a-form-item label="确认密码" name="confirmPassword">
        <a-input-password v-model:value="formState.confirmPassword" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px"
          >注册
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const formState = ref({
  username: "",
  nickname: "",
  phone: "",
  gender: undefined,
  password: "",
  confirmPassword: "",
});

const checkRules = {
  username: [{ required: true, message: "请输入用户名!" }],
  nickname: [{ required: true, message: "请输入昵称!" }],
  phone: [{ required: true, message: "请输入手机号!" }],
  gender: [{ required: true, message: "请选择性别!" }],
  password: [{ required: true, message: "请输入密码!" }],
  confirmPassword: [{ required: true, message: "请确认密码!" }],
};

const register = () => {
  console.log(formState);
};
</script>

<style scoped>
.register-form {
  margin: auto;
  max-width: 480px;
}
</style>
