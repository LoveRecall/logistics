<template>
    <div class="dropDown" @mouseenter="mouseEnter" @mouseleave="mouseLave">
		<el-dropdown trigger="click">
			<div class="checkInputBox" :class="{'active':status}">
				<div class="checkInputBoxPl" v-if="selectedList.length <= 0">{{checkInputBoxPl}}</div>
				<div class="dataBox">
					<span v-for="(item, index) in selectedList" :key="item.id" @click.stop="del(item, index)">{{item.label}}<i class="el-icon-close"></i></span>
				</div>
				<i class="el-icon-arrow-down" :class="{'active':dropDownMouse}"></i>
			</div>
			<el-dropdown-menu slot="dropdown">
				<div class="deepBox">
					<el-input
						:placeholder="searchPlaceholder"
						v-model="filterText">
					</el-input>
					<div class="deep" :style="{'height':treeHeight}">
						<el-tree
							default-expand-all
							:filter-node-method="filterNode"
							@check="getChecked"
							ref="tree"
							:empty-text="emptyText"
							:data="list"
							show-checkbox
							node-key="id"  
							:props="defaultProps"
							@check-change="getChecked"
						><!--check-strictly-->
						</el-tree>
					</div>
				</div>
			</el-dropdown-menu>
		</el-dropdown>
		<div class="data-box-active" @click.stop v-show="dropDownMouse" :style="`right:${dropDownRight}`">
			<span v-for="(item, index) in selectedList" :key="item.id" @click.stop="del(item, index)">{{item.label}}<i class="el-icon-close"></i></span>
		</div>
    </div>
</template>

<script>
	/**dropDown
     * Time -2018-03-20
     * @param { emptyText } - 内容为空时 树形展示的文本
	 * @param { searchPlaceholder } - 搜索框提示文字
	 * @param { checkInputBoxPl } - 操作框提示文字
	 * @param { list } - 树型组件数组
	 * @param { selectedList } - 选中nodes => 返回数组 可用过 vw.$refs.status 取值
	 * @param { getChecked } -methods 当复选框被点击的时候触发 返回值getChecked 
	 * @param { treeHeight } - 树高度 默认 200
	*/ 
	export default {
		data() {
			return {
				filterText: '',
				selectedList:[],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				data:[],
				status: false,
				dropDownMouse: false
			};
		},
		mounted() {
			
		},
		props: {
			emptyText: {
				type: String,
				default: 'no data'
			},
			searchPlaceholder: {
				type: String,
				default: 'Please be here to screen'
			},
			checkInputBoxPl: {
				type: String,
				default: 'Please choose'
			},
			list: {
				type: Array,
				default: []
			},
			treeHeight: {
				type: String,
				default: '200px'
			},
			dropDownRight: {
				type: String,
				default: '-231px'
			}
		},
		computed: {
			
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			},
		},
		methods: {
			filterNode(value, data) {
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			getChecked() {
				this.selectedList = this.$refs.tree.getCheckedNodes(true);
			},
			del(item, index) {
				this.selectedList.splice(index, 1);
				const ergodic = (val, selectedList) => {
					selectedList.forEach(nodes => {
						if (nodes.label === val.label) return this.$refs.tree.setChecked(nodes.id, false);
						if (nodes.children && nodes.children.length) return ergodic(val, nodes.children)
					});
				};
				ergodic(item, this.list);
				if(this.selectedList.length <= 0) this.dropDownMouse = false;
			},
			mouseEnter() {
				if(this.selectedList.length <= 0) return;
				this.dropDownMouse = true;
			},
			mouseLave() {
				this.dropDownMouse = false;
			}
		}
	};
</script>
<style scoped>
  .dropDown >>> .el-dropdown {
	  width:100%;
	  height:100%;
  }
</style>

<style scoped lang="less">
	.deepBox {
		padding:10px;
		.deep {
			margin-top:10px;
			max-height:200px;
			overflow-y: auto;
		}
	}
	.checkInputBox {
		overflow: hidden;
		position: relative;
		-webkit-appearance: none;
		background-color: #fff;
		background-image: none;
		border-radius: 4px;
		border: 1px solid #dcdfe6;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		color: #606266;
		display: inline-block;
		font-size: inherit;
		min-height: 28px;
		outline: 0;
		padding: 0 15px;
		min-width:200px;
		i.el-icon-arrow-down {
			transition: all .5s ease;
			cursor: pointer;
			position: absolute;
			right:10px;
			top:50%;
			transform: translate(0, -50%);
			color:#999;
			font-weight: normal;
			font-size: 12px;
		}
		&.active {
			border-color:#409eff;
			i {
				color:#409eff;
				transform: rotate(180deg);
			}
		}
		width: 100%;
		.dataBox {
			max-height:40px;
			overflow: hidden;
			span {
				background:#f4f4f4;
				color:#94979a;
				padding:8px 8px;
				margin:5px 5px 5px 0;
				border-radius: 5px;
				display:inline-block;
				font-size:12px;
				i {
					font-size:14px;
					cursor: pointer;
				}
			}
		}
		.checkInputBoxPl {
			position: absolute;
			left:10px;
			top:50%;
			transform: translate(0, -50%);
			color:#999;
			font-weight: normal;
			font-size: 12px;
		}
		.el-icon-arrow-up {
			position: absolute;
			right:5px;
			top:50%;
			margin-top:-8px;
		}
	}
	.dropDown {
		position: relative;
		min-width:188px;
		.data-box-active {
			width:230px;
			padding:10px;
			box-sizing: border-box;
			border-radius: 5px;
			box-shadow: 0 0 5px #ccc;
			position:absolute;
			right:-232px;
			top:0;
			background:#fff;
			z-index:999;
			span {
				background:#f4f4f4;
				color:#94979a;
				padding:8px 8px;
				margin:5px 5px 5px 0;
				border-radius: 5px;
				display:inline-block;
				font-size:12px;
				i {
					font-size:14px;
					cursor: pointer;
				}
			}
		}
	}
</style>
