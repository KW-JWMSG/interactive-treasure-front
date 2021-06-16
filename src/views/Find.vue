<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-center">신개념 보물찾기 게임<br /></h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h1 class="text-center mb-5">{{ styleObj.transform }}</h1>
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
        <v-card class="text-center py-12" v-if="currentPerm">
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
        <v-btn color="warning" block> 포기하기 </v-btn>
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
import { getTreasures } from "@/api/treasures";
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
      const data = await getTreasures();
      if (data.data.success) {
        this.currentGame = data.data.data[0];
      }
    },
    orientation(event) {
      const me = this;
      const webkitCompassHeading = event.webkitCompassHeading;
      navigator.geolocation.getCurrentPosition(function (position) {
        const current = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log(me.currentGame)
        const targetDirection = calcDirection(me.currentGame, current);

        const realTargetDirection =
          Number(webkitCompassHeading) - Number(targetDirection);
        me.styleObj.transform = `rotate(${realTargetDirection}deg)`;
      });
    },
    getPermission() {
      if (typeof window.DeviceOrientationEvent.requestPermission === "function") {
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
  },
  components: {},
  data() {
    return {
      currentPerm: false,
      currentGame: null,
      styleObj: { transform: `rotate(0deg)` },
    };
  },
};
</script>
