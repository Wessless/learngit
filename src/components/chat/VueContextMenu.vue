<template>
    <span class="vue-contextmenu-listWrapper" :class="'vue-contextmenuName-' + contextMenuData.menuName">
        <li v-for="(item,index) in contextMenuData.menulists" :key="index" class="context-menu-list">
            <button @click.stop="fnHandler(item)">
                <!-- <i :class="item.icoName"></i> -->
                <span>{{item.btnName}}</span>
            </button>
        </li>
    </span>
</template>
<script>
    export default {
        name: 'VueContextMenu',
        props: {
            contextMenuData: {
                type: Object,
                default () {
                    return {
                        menuName: null,
                        axios: {
                            x: null,
                            y: null
                        },
                        menulists: [
                            // {
                            //     fnHandler: 'adddata',
                            //     icoName: 'fa fa-home fa-fw',
                            //     btnName: 'New'
                            // },
                            // {
                            //     fnHandler: 'savedata',
                            //     icoName: 'fa fa-home fa-fw',
                            //     btnName: 'Save'
                            // }
                        ],
                        menuData:null
                    }
                }
            },
            transferIndex: {
                type: Number,
                default: 0
            }
        },
        watch: {
            'contextMenuData.axios' (val) {
                var x = val.x
                var y = val.y
                var _this = this
                var index = _this.transferIndex
                var menuName = 'vue-contextmenuName-' + _this.contextMenuData.menuName
                var menu = document.getElementsByClassName(menuName)[index]
                menu.style.display = 'block'
                menu.style.left = x + 'px'
                menu.style.top = y + 'px'
                document.addEventListener('mouseup', function () {
                    menu.style.display = 'none'
                }, false)
            }
        },
        methods: {
            fnHandler (item) {
                this.$emit(item.fnHandler,this.contextMenuData.menuData);
            }
        }
    }
</script>
<style>
.vue-contextmenu-listWrapper {
    box-shadow: 2px 2px 2px #ffffff;
    border-radius: 4px;
    overflow: hidden;
    display: none;
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    box-shadow: 0px 1px 3px rgba(34, 25, 25, 0.2);
}
.vue-contextmenu-listWrapper .context-menu-list {
    width: 150px;
    height: 32px;
    border-radius: 4px;
    background: #ffffff;
    text-decoration: none;
    list-style: none;
}
.vue-contextmenu-listWrapper .context-menu-list button {
    cursor: pointer;
    width: 100%;
    height: 100%;
    display: block;
    padding-left: 15px;
    background: #ffffff;
    outline: 0;
    border: 0;
}
.vue-contextmenu-listWrapper .context-menu-list{
    border-top: 1px solid #dddddd;
}
.vue-contextmenu-listWrapper .context-menu-list:first-child{
    border-top: 0;
}
.vue-contextmenu-listWrapper .context-menu-list button i,  .vue-contextmenu-listWrapper .context-menu-list button span {
    float: left;
}
.vue-contextmenu-listWrapper .context-menu-list button i{
    padding: 0 10px 0 10px;
}
.vue-contextmenu-listWrapper .context-menu-list button:hover {
    box-shadow: 0px 1px 3px rgba(34, 25, 25, 0.2);
    color: #333333;
    border-radius: 4px;
    background: -webkit-linear-gradient(bottom, #D5EDFE , #D5EDFE);
    background: -o-linear-gradient(bottom, #D5EDFE, #D5EDFE);
    background: -moz-linear-gradient(bottom, #D5EDFE, #D5EDFE);
    background: linear-gradient(to bottom, #D5EDFE , #D5EDFE);
    /* box-shadow: 0px 1px 3px rgba(34, 25, 25, 0.2);
    color: #ffffff;
    border-radius: 4px;
    background: -webkit-linear-gradient(bottom, #5a6a76 , #2e3940);
    background: -o-linear-gradient(bottom, #5a6a76, #2e3940);
    background: -moz-linear-gradient(bottom, #5a6a76, #2e3940);
    background: linear-gradient(to bottom, #5a6a76 , #2e3940); */
}
</style>