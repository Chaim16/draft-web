const ACCESS_ENUM = {
  UNKNOWN: "unknown",
  GENERAL: "general",
  DESIGNER: "designer",
  ADMIN: "admin",
};

const ROLE_MAP = {
  unknown: "未知",
  general: "普通用户",
  designer: "设计师",
  administrator: "管理员",
};

const GENDER_MAP = {
  male: "男",
  female: "女",
};

const DESIGNER_APPLICATION_STATUS_MAP = {
  wait_approval: "待审核",
  PASS: "已通过",
  REFUSE: "未通过",
};

export { ACCESS_ENUM, ROLE_MAP, GENDER_MAP, DESIGNER_APPLICATION_STATUS_MAP };
