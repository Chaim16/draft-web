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
          >{{ GENDER_MAP[userInfo.gender] }}
        </a-descriptions-item>
        <a-descriptions-item label="角色">
          <a-tag :color="userInfo.role === '设计师' ? 'green' : 'blue'">
            {{ ROLE_MAP[userInfo.role] }}
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

        <a-button
          v-if="userInfo.role !== 'designer'"
          @click="showApplicationModal"
        >
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
        <a-form-item label="手机号" required>
          <a-input v-model:value="editForm.phone" />
        </a-form-item>
        <a-form-item label="性别" required>
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

    <!-- 申请设计师模态框 -->
    <a-modal
      v-model:visible="applicationVisible"
      :title="applicationTitle"
      @ok="handleApplicationSubmit"
      @cancel="handleApplicationCancel"
      :destroyOnClose="true"
    >
      <div v-if="applicationInfo.status === 'wait_apply'">
        <a-form :model="applicationForm" layout="vertical">
          <a-form-item label="申请理由" required>
            <a-textarea v-model:value="applicationForm.reason" />
          </a-form-item>
        </a-form>
      </div>
      <div v-else>
        <p>
          审批状态：
          <a-tag :color="applicationInfo.status === 'pass' ? 'green' : 'blue'">
            {{ DESIGNER_APPLICATION_STATUS_MAP[applicationInfo.status] }}
          </a-tag>
        </p>
        <a-divider />
        <p>申请时间： {{ formatTimestamp(applicationInfo.createTime) }}</p>
        <p>申请理由： {{ applicationInfo.reason }}</p>
        <a-divider />
        <p>
          审批时间：
          {{
            applicationInfo.approvalTime
              ? formatTimestamp(applicationInfo.approvalTime)
              : ""
          }}
        </p>
        <p>审批意见： {{ applicationInfo.approvalOpinions }}</p>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import {
  EditOutlined,
  UserAddOutlined,
  WalletOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import api from "@/api/api";
import {
  GENDER_MAP,
  ROLE_MAP,
  DESIGNER_APPLICATION_STATUS_MAP,
} from "@/utils/constant";
import { ApiResponse } from "@/utils/axios";
import formatTimestamp from "@/utils/public";

interface OrderItem {
  orderNo: string;
  artworkId: string;
  date: string;
  amount: number;
  status: number;
  designer: string;
}

// 用户数据
const userInfo = reactive({
  username: "",
  nickname: "",
  phone: "",
  gender: "",
  role: "",
  balance: 0,
});

const getUserInfo = () => {
  api.userDetail().then((res) => {
    if (res.code === 0) {
      userInfo.username = res.data.username;
      userInfo.nickname = res.data.nickname;
      userInfo.phone = res.data.phone;
      userInfo.gender = res.data.gender === 1 ? "male" : "female";
      userInfo.role = res.data.role;
      userInfo.balance = res.data.balance;
    } else {
      message.error(res.message);
    }
  });
};
getUserInfo();

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
  phone: "",
});

const showEditModal = () => {
  editForm.nickname = userInfo.nickname;
  editForm.gender = userInfo.gender;
  editForm.phone = userInfo.phone;
  editVisible.value = true;
};

const handleEditSubmit = () => {
  const params = {
    nickname: editForm.nickname,
    gender: editForm.gender == "male" ? 1 : 0,
    phone: editForm.phone,
  };
  try {
    api.userModify(params).then((res: ApiResponse) => {
      if (res.code === 0) {
        message.success("个人信息更新成功");
        getUserInfo();
      } else {
        message.error(res.message);
      }
    });
  } catch (e) {
    message.error("更新失败!");
  } finally {
    editVisible.value = false;
  }
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

// 申请设计师功能
const applicationVisible = ref(false);
const applicationForm = reactive({
  reason: "",
});

const applicationInfo = reactive({
  status: "wait_apply",
  reason: "",
  createTime: "",
  approvalOpinions: "",
  approvalTime: "",
});

const showApplicationModal = () => {
  // 判断用户是否已经提交过申请
  checkApplicationStatus();
  applicationVisible.value = true;
};

const checkApplicationStatus = () => {
  api.designerApplicationRecord().then((res: ApiResponse) => {
    if (res.code !== 0) {
      message.error(res.message);
    } else {
      console.log(res);
      if (res.data) {
        const record = res.data;
        applicationInfo.status = record.status;
        applicationInfo.reason = record.reason;
        applicationInfo.createTime = record.create_time;
        applicationInfo.approvalOpinions = record.approval_opinions;
        applicationInfo.approvalTime = record.approval_time;
      } else {
        applicationInfo.status = "wait_apply"; // 如果没有申请记录，则显示为待申请状态
      }
    }
  });
};

const handleApplicationSubmit = () => {
  if (applicationInfo.status === "wait_apply") {
    const params = {
      reason: applicationForm.reason,
    };
    api.applyAsDesigner(params).then((res: ApiResponse) => {
      if (res.code === 0) {
        message.success("提交成功，请等待审批");
      } else {
        message.error(res.message);
      }
    });
  }
  applicationVisible.value = false;
};

const handleApplicationCancel = () => {
  applicationVisible.value = false;
};

const applicationTitle = computed(() => {
  return applicationInfo.status === "wait_apply" ? "申请设计师" : "审批信息";
});
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
