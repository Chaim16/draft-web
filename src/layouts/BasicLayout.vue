<template>
  <div id="basicLayout">
    <a-layout>
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="http://www.baidu.com">yuqm</a>
      </a-layout-footer>
    </a-layout>
  </div>
  <router-view />
</template>
<script>
import { defineComponent } from "vue";
import GlobalHeader from "@/components/GlobalHeader.vue";

export default defineComponent({
  components: { GlobalHeader },
});
</script>
<style>
#basicLayout {
  height: 100%;
}

#basicLayout .header {
}

#basicLayout .content {
  padding: 20px;
  background: linear-gradient(to right, #bbb, #fff);
}

#basicLayout .footer {
  text-align: center;
}
</style>
