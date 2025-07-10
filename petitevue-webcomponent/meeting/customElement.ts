export class SlCard extends HTMLElement {
  constructor() {
    super();
    const randomHash = Math.random().toString(36).slice(2);
    // 创建影子DOM
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = /*html*/`
      <style>
        .sl-card {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .title {
          height: 30px;
          padding: 0 10px;
          background-color: #000;
          color: #efefef;
          line-height: 30px;
        }
        .content {
          flex: 1;
          padding: 10px;
          min-height: 1px;
        }
      </style>
      <div class="sl-card" v-scope id="sl-${randomHash}" part="sl-card">
        <div class="title">
          <span>{{ title }}</span>
          <slot name="title"></slot>
        </div>
        <div class="content" @click="contentEmit($event)">
          <slot name="content"></slot>
        </div>  
      </div>
    `;
    PetiteVue.createApp(this.data).mount(this.shadowRoot!.querySelector(`#sl-${randomHash}`));
  }
  data: any = {
    title: 'Demo Title',
    changeTitle(title: string) {
      this.title = title
    },
    contentEmit: () => {
      console.log('content emit');
      const evt = new CustomEvent('contentemit', { bubbles: true, composed: true, detail: this.data });
      this.dispatchEvent(evt);
    }
  };
  connectedCallback() {
    console.log("自定义元素添加至页面。");
  }

  disconnectedCallback() {
    console.log("自定义元素从页面中移除。");
  }

  adoptedCallback() {
    console.log("自定义元素移动至新页面。");
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (name == "title") {
      this.data.changeTitle(newValue)
    }
  }

  static get observedAttributes() {
    return ["count"];
  }
}
