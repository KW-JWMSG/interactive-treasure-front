<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title @click="$router.push('/')" style="cursor: pointer">
        디지털 보물찾기 프로젝트
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn text @click="lgnbtn" v-if="is_ready">
        <span
          class="mr-2"
          v-if="!$store.state.is_logined"
          :v-bind="$store.state.is_logined"
          >로그인</span
        >
        <span
          class="mr-2"
          v-if="$store.state.is_logined"
          :v-bind="$store.state.is_logined"
          >로그아웃</span
        >
        <v-icon>mdi-login</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view class="py-12" />
    </v-main>
  </v-app>
</template>

<script>
import { checkLogin, doLogout } from "@/api/auth";
export default {
  name: "App",
  mounted() {
    this.chkLgn();
  },

  methods: {
    async lgnbtn() {
      if (this.$store.state.is_logined) {
        const data = await doLogout();
        if (data.data.success) {
          alert("로그아웃 되었습니다.");
          this.$store.state.is_logined = false;
        }
      }
      this.$router.push("/login");
    },
    async chkLgn() {
      const lgndata = await checkLogin();
      if (lgndata.data.success) {
        this.$store.state.is_logined = true;
      } else {
        this.$store.state.is_logined = false;
      }
      this.is_ready = true;
    },
  },
  data: () => ({
    is_logind: false,
    is_ready: false,
  }),
};
</script>
