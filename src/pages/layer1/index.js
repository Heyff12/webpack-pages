import tpl from './layer.html';
import './layer.less';
// function layer() {
//     return {
//         name: 'layer',
//         tpl: tpl
//     }
// }

// export default layer;
// const App = function() {
//     var dom = document.getElementById('app');
//     var layer = new Layer();
//     dom.innerHTML = layer.tpl({
//     	name:'hshahha',
//     	arr:['xiaomi','apple','pear']
//     });
// }

// new App()
var dom = document.getElementById('app');
dom.innerHTML = tpl