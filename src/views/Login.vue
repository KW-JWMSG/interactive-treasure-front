<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-center">신개념 보물찾기 게임<br />로그인</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="user_id"
          :counter="50"
          label="유저 아이디"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="password"
          :counter="50"
          label="접속암호"
          type="password"
          required
          @keydown.enter="doLogin"
        ></v-text-field>
      </v-col>
      <!-- <v-col>
        <v-text-field
          v-model="firstname"
          :rules="nameRules"
          :counter="50"
          label="유저 이름"
          required
        ></v-text-field>
      </v-col> -->
    </v-row>
    <v-row>
      <v-col cols="12"
        ><v-btn color="success" block class="py-5" @click="doLogin"> 로그인 </v-btn></v-col
      >
      <v-col cols="12"
        ><v-btn color="info" block class="py-5" @click="$router.push('/Join');"> 가입하기 </v-btn></v-col
      >
    </v-row>
  </v-container>
</template>

<script>
import {doLogin} from '@/api/auth'
export default {
  name: "Login",
  methods: {
    async doLogin() {
      const data = await doLogin(this.user_id, this.password)
      if(!data.data.success){
        alert(data.data.message)
        return;
      }
      this.$store.state.is_logined = true;
      this.$router.push('/');
    },
  },
  components: {},
  data() {
    return {
      user_id: null,
      password: null,
    };
  },
};
</script>
