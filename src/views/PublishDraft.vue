<template>
  <div
    id="artwork-publish"
    :style="backgroundStyle"
    class="background-container"
  >
    <a-form
      class="publish-form"
      :model="formState"
      @submit="publish"
      auto-label-width
      label-align="left"
      :rules="checkRules"
    >
      <a-form-item label="画稿标题" name="title">
        <a-input v-model:value="formState.title" />
      </a-form-item>

      <a-form-item label="画稿描述" name="description">
        <a-textarea v-model:value="formState.description" :rows="4" />
      </a-form-item>

      <a-form-item label="价格" name="price">
        <a-input-number v-model:value="formState.price" :min="0" />
      </a-form-item>

      <a-form-item label="分类" name="category">
        <a-select v-model:value="formState.category">
          <a-select-option value="illustration">插画</a-select-option>
          <a-select-option value="concept">概念设计</a-select-option>
          <a-select-option value="character">角色设计</a-select-option>
          <a-select-option value="environment">场景设计</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="画稿图片" name="image">
        <a-upload
          v-model:file-list="fileList"
          list-type="picture-card"
          :before-upload="beforeUpload"
          @preview="handlePreview"
        >
          <div v-if="fileList.length < 1">
            <plus-outlined />
            <div style="margin-top: 8px">上传</div>
          </div>
        </a-upload>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px"
          >发布
        </a-button>
      </a-form-item>
    </a-form>

    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="previewVisible = false"
    >
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { computed } from "vue";
import type { UploadFile } from "ant-design-vue";

const formState = ref({
  title: "",
  description: "",
  price: 0,
  category: undefined,
});

const fileList = ref<UploadFile[]>([]);
const previewVisible = ref(false);
const previewImage = ref("");
const backgroundImageUrl = ref("");

const checkRules = {
  title: [{ required: true, message: "请输入画稿标题!" }],
  description: [{ required: true, message: "请输入画稿描述!" }],
  price: [{ required: true, message: "请输入价格!" }],
  category: [{ required: true, message: "请选择分类!" }],
  image: [{ required: true, message: "请上传画稿图片!" }],
};

const beforeUpload = (file: UploadFile) => {
  fileList.value = [file];

  // 生成图片预览URL
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      backgroundImageUrl.value = e.target.result as string;
    }
  };
  reader.readAsDataURL(file as unknown as Blob);

  return false;
};

// 计算属性处理背景样式
const backgroundStyle = computed(() => ({
  backgroundImage: backgroundImageUrl.value
    ? `url(${backgroundImageUrl.value})`
    : "none",
}));

const handlePreview = (file: UploadFile) => {
  previewImage.value = file.url || file.thumbUrl;
  previewVisible.value = true;
};

const publish = () => {
  console.log(formState.value, fileList.value);
};
</script>

<style scoped>
#artwork-publish {
  padding: 40px 24px;
  min-height: 100vh;
}

.publish-form {
  margin: auto;
  max-width: 600px;
  padding: 32px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

/* 表单项间距优化 */
:deep(.ant-form-item) {
  margin-bottom: 24px;
}

/* 标签样式增强 */
:deep(.ant-form-item-label label) {
  font-weight: 500;
  color: #2c3e50;
}

.background-container {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-image 0.5s ease;
  position: relative;
}

/* 添加遮罩层提升可读性 */
.background-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  z-index: 0;
}

/* 提升表单可见性 */
.publish-form {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
}

/* 调整阴影增强对比度 */
.publish-form {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
</style>
