<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-center">신개념 보물찾기 게임<br /></h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h1 class="text-center mb-5">보물 목록</h1>
        <v-card>
          <v-list>
            <div v-if="items.length == 0" class="text-center">
              아직 보물이 존재하지 않습니다.
            </div>
            <v-list-item-group
              v-model="selectedItem"
              color="primary"
              v-if="items.length != 0"
            >
              <v-list-item v-for="item in items" :key="item.treasure_id">
                <v-list-item-content>
                  <v-list-item-title
                    >{{ item.user_id }}이 숨긴 보물 ({{
                      Number(item.latitude).toFixed(5)
                    }}/{{
                      Number(item.longitude).toFixed(5)
                    }})</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="success" block @click="startGame()">
          게임 시작하기
        </v-btn>
      </v-col>
      <v-col>
        <v-btn color="info" block @click="$router.push('/rank')">
          랭킹보기
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getTreasures } from "@/api/treasures";
import { currentGame, createGame } from "@/api/games";
export default {
  name: "TList",
  mounted() {
    this.checkGame();
    this.getList();
  },
  methods: {
    async checkGame() {
      const data = await currentGame();
      if (data.data.success) {
        alert("진행중인 보물이 존재합니다.");
        this.$router.push("/find");
      }
    },
    async getList() {
      const data = await getTreasures();
      if (!data.data.success) {
        alert(data.data.message);
        return;
      }
      this.items = data.data.data;
    },
    async startGame() {
      if (this.selectedItem == null) {
        alert("진행할 보물을 선택하세요.");
        return;
      }
      const data = await createGame(this.items[this.selectedItem].treasure_id);
      if (!data.data.success) {
        alert(data.data.message);
        return;
      }
      this.$router.push("/find");
    },
  },
  components: {},
  data() {
    return {
      items: [],
      selectedItem: null,
    };
  },
};
</script>
