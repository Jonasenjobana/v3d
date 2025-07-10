export default async function geMeetingInfo() {
  PetiteVue.createApp({
    $template: `<div>{{ count }}</div>`,
    count: 1,
    name: "John Doe",
    show: true,
    onContentEmit2(e: any) {
      console.log(e,'onContentEmit')
    },
    updateName() {
      console.log(this.name);
    },
    update() {
      if (this.name == "wtf") {
        PetiteVue.nextTick(() => (this.name = "wtf123123"));
      }
    },
    inc(e: any) {
      console.log(this, e);
      this.count++;
    },
    mounted() {
      console.log(`I'm mounted!`, this);
    },
  }).mount('#meeting');
}

export function onDestroy() {}
