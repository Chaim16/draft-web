<template>
  <div id="container">
    <a-card title="用户列表" bordered class="order-card">
      <a-table
        :dataSource="userList"
        :columns="columns"
        :pagination="pagination"
        class="order-table"
        rowKey="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operate'">
            <a-button danger @click="deleteUser(record.id)"> 删除</a-button>
          </template>
          <template v-else-if="column.key === 'role'">
            <a-tag :color="record.role === 'designer' ? 'green' : 'blue'">
              {{ ROLE_MAP[record.role] }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'gender'">
            {{ record.gender === 1 ? "男" : "女" }}
          </template>
          <template v-else>
            <a-td>{{ record[column.dataIndex] }}</a-td>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import api from "@/api/api";
import { ApiResponse } from "@/utils/axios";
import { ROLE_MAP } from "../../utils/constant";

const userList = ref([]);

const getUserList = () => {
  api.userList({}).then((res: ApiResponse) => {
    if (res.code === 0) {
      userList.value = res.data?.list.map((item: object) => {
        return item;
      });
    } else {
      message.error(res.message);
    }
  });
};

getUserList();

const pagination = ref({
  pageSize: 10,
  current: 1,
  total: userList.value.length,
});

watch(userList, () => {
  pagination.value.total = userList.value.length;
});

const columns = [
  { title: "序号", dataIndex: "id", key: "id" },
  { title: "用户名", dataIndex: "username", key: "username" },
  { title: "昵称", dataIndex: "nickname", key: "nickname" },
  {
    title: "角色",
    dataIndex: "role",
    key: "role",
  },
  { title: "性别", dataIndex: "gender", key: "gender" },
  { title: "手机号", dataIndex: "phone", key: "phone" },
  { title: "操作", key: "operate" },
];

const deleteUser = () => {
  message.success("删除成功");
};
</script>

<style scoped>
#container {
  align-items: center;
  margin-left: 15%;
}

.order-card {
  width: 80%;
  align-items: center;
}

.order-table {
}
</style>
