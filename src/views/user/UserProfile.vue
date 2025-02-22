<template>
  <div class="user-profile-container">
    <!-- 个人信息展示区 -->
    <a-card title="个人资料" class="profile-card">
      <a-descriptions :column="2">
        <a-descriptions-item label="用户名"
          >{{ userInfo.username }}
        </a-descriptions-item>
        <a-descriptions-item label="昵称"
          >{{ userInfo.nickname }}
        </a-descriptions-item>
        <a-descriptions-item label="手机号"
          >{{ userInfo.phone || "未绑定" }}
        </a-descriptions-item>
        <a-descriptions-item label="性别"
          >{{ genderMap[userInfo.gender] }}
        </a-descriptions-item>
        <a-descriptions-item label="角色">
          <a-tag :color="userInfo.role === '设计师' ? 'green' : 'blue'">
            {{ userInfo.role }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="账户余额">
          <span class="balance">¥{{ userInfo.balance.toFixed(2) }}</span>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <!-- 操作按钮区 -->
    <div class="action-area">
      <a-space :size="16">
        <a-button type="primary" @click="showEditModal">
          <template #icon>
            <EditOutlined />
          </template>
          修改信息
        </a-button>

        <a-button v-if="userInfo.role !== '设计师'" @click="applyDesigner">
          <template #icon>
            <UserAddOutlined />
          </template>
          申请设计师
        </a-button>

        <a-button type="dashed" @click="showRechargeModal">
          <template #icon>
            <WalletOutlined />
          </template>
          立即充值
        </a-button>
      </a-space>
    </div>

    <!-- 订单列表区 -->
    <a-card title="我的订单" class="order-card">
      <a-table
        :columns="orderColumns"
        :data-source="orderList"
        :pagination="{ pageSize: 8 }"
        row-key="orderNo"
      >
        <template #status="{ text }">
          <a-tag :color="getStatusColor(text)">
            {{ getStatusText(text) }}
          </a-tag>
        </template>

        <template #artworkId="{ text }">
          <router-link :to="`/artwork/${text}`" class="artwork-link">
            {{ text }}
          </router-link>
        </template>

        <template #action="{ record }">
          <a-space>
            <a-button
              size="small"
              @click="handleCancelOrder(record)"
              :disabled="record.status !== 1"
            >
              {{ record.status === 1 ? "取消订单" : "申请退款" }}
            </a-button>

            <a-button type="link" danger @click="handleDeleteOrder(record)">
              删除
            </a-button>

            <a-button type="primary" ghost @click="handleReorder(record)">
              再来一单
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <!-- 修改信息模态框 -->
    <a-modal
      v-model:visible="editVisible"
      title="修改个人信息"
      @ok="handleEditSubmit"
      @cancel="handleEditCancel"
      :destroyOnClose="true"
    >
      <a-form :model="editForm" layout="vertical">
        <a-form-item label="昵称" required>
          <a-input v-model:value="editForm.nickname" />
        </a-form-item>
        <a-form-item label="性别">
          <a-select v-model:value="editForm.gender">
            <a-select-option value="male">男</a-select-option>
            <a-select-option value="female">女</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 充值模态框 -->
    <a-modal
      v-model:visible="rechargeVisible"
      title="账户充值"
      @ok="handleRecharge"
      @cancel="handleRechargeCancel"
    >
      <a-radio-group v-model:value="selectedAmount" class="recharge-options">
        <a-radio-button :value="50">50元</a-radio-button>
        <a-radio-button :value="100">100元</a-radio-button>
        <a-radio-button :value="200">200元</a-radio-button>
        <a-radio-button :value="500">500元</a-radio-button>
      </a-radio-group>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  EditOutlined,
  UserAddOutlined,
  WalletOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

interface UserInfo {
  username: string;
  nickname: string;
  phone?: string;
  gender: string;
  role: string;
  balance: number;
}

interface OrderItem {
  orderNo: string;
  artworkId: string;
  date: string;
  amount: number;
  status: number;
  designer: string;
}

// 用户数据
const userInfo = reactive<UserInfo>({
  username: "artlover2024",
  nickname: "艺术爱好者",
  phone: "138****0000",
  gender: "male",
  role: "普通用户",
  balance: 2688.5,
});

// 订单数据
const orderList = ref<OrderItem[]>([
  {
    orderNo: "20240320001",
    artworkId: "ART-2024-001",
    date: "2024-03-20 14:30",
    amount: 599.0,
    status: 1,
    designer: "设计师张三",
  },
  {
    orderNo: "20240320001",
    artworkId: "ART-2024-001",
    date: "2024-03-20 14:30",
    amount: 599.0,
    status: 1,
    designer: "设计师张三",
  },
  {
    orderNo: "20240320001",
    artworkId: "ART-2024-001",
    date: "2024-03-20 14:30",
    amount: 599.0,
    status: 1,
    designer: "设计师张三",
  },
  {
    orderNo: "20240320001",
    artworkId: "ART-2024-001",
    date: "2024-03-20 14:30",
    amount: 599.0,
    status: 1,
    designer: "设计师张三",
  },
  {
    orderNo: "20240320001",
    artworkId: "ART-2024-001",
    date: "2024-03-20 14:30",
    amount: 599.0,
    status: 1,
    designer: "设计师张三",
  },
  {
    orderNo: "20240320001",
    artworkId: "ART-2024-001",
    date: "2024-03-20 14:30",
    amount: 599.0,
    status: 1,
    designer: "设计师张三",
  },
  {
    orderNo: "20240320001",
    artworkId: "ART-2024-001",
    date: "2024-03-20 14:30",
    amount: 599.0,
    status: 1,
    designer: "设计师张三",
  },
  {
    orderNo: "20240320001",
    artworkId: "ART-2024-001",
    date: "2024-03-20 14:30",
    amount: 599.0,
    status: 1,
    designer: "设计师张三",
  },
  {
    orderNo: "20240320001",
    artworkId: "ART-2024-001",
    date: "2024-03-20 14:30",
    amount: 599.0,
    status: 1,
    designer: "设计师张三",
  },
  {
    orderNo: "20240319002",
    artworkId: "ART-2024-045",
    date: "2024-03-19 09:15",
    amount: 1299.0,
    status: 3,
    designer: "设计师李四",
  },
]);

// 订单状态配置
const statusConfig = {
  "1": { text: "待支付", color: "orange" },
  "2": { text: "进行中", color: "blue" },
  "3": { text: "已完成", color: "green" },
  "4": { text: "已取消", color: "red" },
  "5": { text: "退款中", color: "gold" },
};

// 表格列配置
const orderColumns = [
  { title: "订单号", dataIndex: "orderNo", width: 180 },
  {
    title: "画稿ID",
    dataIndex: "artworkId",
    slots: { customRender: "artworkId" },
  },
  {
    title: "下单时间",
    dataIndex: "date",
    sorter: (a: OrderItem, b: OrderItem) =>
      new Date(a.date).getTime() - new Date(b.date).getTime(),
  },
  { title: "金额（元）", dataIndex: "amount", align: "right" },
  { title: "状态", dataIndex: "status", slots: { customRender: "status" } },
  { title: "操作", slots: { customRender: "action" }, width: 240 },
];

// 编辑功能
const editVisible = ref(false);
const editForm = reactive({
  nickname: "",
  gender: "",
});

const showEditModal = () => {
  editForm.nickname = userInfo.nickname;
  editForm.gender = userInfo.gender;
  editVisible.value = true;
};

const handleEditSubmit = () => {
  userInfo.nickname = editForm.nickname;
  userInfo.gender = editForm.gender;
  editVisible.value = false;
  message.success("个人信息更新成功");
};

// 充值功能
const rechargeVisible = ref(false);
const selectedAmount = ref(50);
const customAmount = ref<number | null>(null);

const showRechargeModal = () => {
  rechargeVisible.value = true;
};

const handleRecharge = () => {
  const amount = customAmount.value || selectedAmount.value;
  userInfo.balance += amount;
  rechargeVisible.value = false;
  message.success(`成功充值 ¥${amount.toFixed(2)}`);
};

// 订单操作
const handleCancelOrder = (order: OrderItem) => {
  message.loading("正在处理...", 1).then(() => {
    order.status = 4;
    message.success("订单已取消");
  });
};

const handleDeleteOrder = (order: OrderItem) => {
  const index = orderList.value.findIndex((o) => o.orderNo === order.orderNo);
  orderList.value.splice(index, 1);
  message.success("订单已删除");
};

const handleReorder = (order: OrderItem) => {
  message.info(`已重新下单画稿：${order.artworkId}`);
};

// 辅助方法
const getStatusText = (status: never) => {
  return "未知" || statusConfig[status];
};
const getStatusColor = (status: never) => {
  return "gray" || statusConfig[status];
};
const genderMap = { male: "男", female: "女" };
</script>

<style scoped lang="scss">
.user-profile-container {
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 20px;

  .profile-card {
    margin-bottom: 24px;

    :deep(.ant-descriptions-item-label) {
      width: 100px;
      color: #666;
      font-weight: normal;
    }

    .balance {
      color: #ff4d4f;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .action-area {
    margin-bottom: 32px;
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;
  }

  .order-card {
    :deep(.ant-table-thead th) {
      background: #fafafa;
    }

    .artwork-link {
      color: #40a9ff;

      &:hover {
        color: #1890ff;
        text-decoration: underline;
      }
    }

    :deep(.ant-btn-link[disabled]) {
      color: rgba(0, 0, 0, 0.25);
    }
  }

  .recharge-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 16px;

    :deep(.ant-radio-button-wrapper) {
      text-align: center;
    }
  }

  .custom-amount {
    width: 100%;
    margin-top: 12px;
  }
}

@media (max-width: 768px) {
  .user-profile-container {
    padding: 0 12px;

    .profile-card :deep(.ant-descriptions-item) {
      display: block;
      padding: 8px 0;
    }

    .action-area :deep(.ant-space) {
      width: 100%;
      flex-direction: column;

      .ant-btn {
        width: 100%;
        margin-bottom: 8px;
      }
    }

    .recharge-options {
      grid-template-columns: 1fr;
    }
  }
}
</style>
