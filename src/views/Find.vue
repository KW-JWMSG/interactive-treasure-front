<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-center">신개념 보물찾기 게임<br /></h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h1 class="text-center mb-5" v-if="currentPerm">
          이곳으로 부터 {{ distance }} 미터
        </h1>
        <h2 class="text-center mb-5" v-if="!currentPerm">
          권한승인 후 진행해 주세요!
        </h2>
        <v-btn
          class="py-12"
          block
          color="success"
          style="font-size: 2rem"
          v-if="!currentPerm"
          @click="getPermission()"
        >
          권한 허가
        </v-btn>
        <v-card class="text-center py-12">
          <img
            :src="require('@/assets/arrow.svg')"
            alt=""
            v-bind:style="styleObj"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="info" block @click="$router.push('/rank')">
          랭킹보기
        </v-btn>
      </v-col>
      <v-col>
        <v-btn color="warning" block @click="dropGame"> 포기하기 </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
function calcDirection(target, current) {
  const target_chi = (target.latitude * Math.PI) / 180;
  const current_chi = (current.latitude * Math.PI) / 180;
  const target_lambda = (target.longitude * Math.PI) / 180;
  const current_lambda = (current.longitude * Math.PI) / 180;
  const y = Math.sin(target_lambda - current_lambda) * Math.cos(target_chi);
  const x =
    Math.cos(current_chi) * Math.sin(target_chi) -
    Math.sin(current_chi) *
      Math.cos(target_chi) *
      Math.cos(target_lambda - current_lambda);
  const rad_direction = Math.atan2(y, x);
  const bearing = ((rad_direction * 180) / Math.PI + 360) % 360;
  return bearing;
}

function calcDistence(target, current) {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  var r = 6371; //지구의 반지름(km)
  var dLat = deg2rad(target.latitude - current.latitude);
  var dLon = deg2rad(target.longitude - current.longitude);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(current.latitude)) *
      Math.cos(deg2rad(target.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = r * c; // Distance in km
  return Math.round(d * 1000);
}
// import { getTreasures } from "@/api/treasures";
import { doFail, doSuccess,currentGame } from "@/api/games";
// import { currentGame, createGame } from "@/api/games";
export default {
  name: "Find",
  mounted() {
    this.startFind();
  },
  computed: {
    rotateR() {
      return this.rotate;
    },
  },
  methods: {
    async startFind() {
      const data = await currentGame();
      if (data.data.success) {
        console.log(data.data)
        this.currentGame = data.data.data;
      }
    },
    orientation(event) {
      const me = this;
      let webkitCompassHeading = event.webkitCompassHeading;
      if (typeof webkitCompassHeading === "undefined") {
        webkitCompassHeading = 360 - event.alpha
      }
      navigator.geolocation.getCurrentPosition(function (position) {
        const current = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log(me.currentGame);
        const targetDirection = calcDirection(me.currentGame, current);
        me.distance = calcDistence(me.currentGame, current);

        const realTargetDirection =
          Number(targetDirection) - Number(webkitCompassHeading);
        me.styleObj.transform = `rotate(${realTargetDirection}deg)`;
        if (me.distance != null && me.distance < 5) {
          me.successGame();
        }
      });
    },
    getPermission() {
      if (
        typeof window.DeviceOrientationEvent.requestPermission === "function"
      ) {
        window.DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === "granted") {
              window.addEventListener(
                "deviceorientation",
                this.orientation,
                true
              );
              this.currentPerm = true;
            } else if (response === "prompt") {
              alert(response + "모드가 필요합니다.");
            } else {
              alert(response + "!! 권한이 필요합니다.");
            }
          })
          .catch((err) => {
            alert("에러!" + err);
          });
      } else {
        window.addEventListener(
          "deviceorientationabsolute",
          this.orientation,
          true
        );
        this.currentPerm = true;
      }
    },
    async successGame() {
      const data = await doSuccess(this.currentGame.treasure_id);
      if (data.data.success) {
        alert("게임에서 승리하셨습니다!");
        this.$router.push("/");
      }
    },
    async dropGame() {
      alert(JSON.stringify(this.currentGame))
      const data = await doFail(this.currentGame.game_id);
      if (data.data.success) {
        alert("게임을 포기하셨습니다.");
        this.$router.push("/");
      }
    },
  },
  components: {},
  data() {
    return {
      currentPerm: false,
      currentGame: null,
      styleObj: { transform: `rotate(0deg)` },
      distance: null,
    };
  },
};
</script>
