<template>
  <v-container id="Home">
    <v-row>
      <v-col>
        <h1 class="text-center">신개념 보물찾기 게임</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-btn
          block
          color="info"
          class="py-12"
          style="font-size: 3rem"
          @click="goFind"
        >
          보물찾기
        </v-btn>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn
          block
          color="success"
          class="py-12"
          style="font-size: 3rem"
          @click="goHide"
        >
          보물숨기기
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { createTreasures } from "@/api/treasures";
export default {
  name: "Home",

  components: {},

  methods: {
    goHide() {
      if (!confirm("이곳에 숨기겠습니까?")) {
        return;
      }
      if (this.$store.state.is_logined) {
        navigator.geolocation.getCurrentPosition(async function (position) {
          const data = await createTreasures(
            position.coords.latitude,
            position.coords.longitude
          );
          if (data.data.success) alert("숨겼습니다!");
          else{
            if(data.data.error) alert(data.data.error)
            if(data.data.message) alert(data.data.message)
          }
        });
      } else {
        alert("로그인 후 이용 가능합니다.");
        this.$router.push("/login");
      }
    },
    goFind() {
      if (this.$store.state.is_logined) {
        this.$router.push("/list");
      } else {
        alert("로그인 후 이용 가능합니다.");
        this.$router.push("/login");
      }
    },
  },
};
</script>
