// import React, { Component } from 'react';
// import fire from '../../fire';
// import TextField from '@material-ui/core/TextField';
// import MenuItem from '@material-ui/core/MenuItem';
// import Select from '@material-ui/core/Select';
// import InputLabel from '@material-ui/core/InputLabel';

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { 
//                   itemName: '',
//                   boughtFrom: '',
//                   itemCost: '',
//                   sold: false,
//                   messages: [], 
//                   items: [] 
//     }; 
//   }
//   componentWillMount(){
//     /* Create reference to messages in Firebase Database */

//     fire.firestore().collection("Items")
//     .onSnapshot((snapshot) => {
//       snapshot.docChanges().forEach((change) => {
//         if (change.type === "added") {
//             let changed = {
//               sold: change.doc.data().Sold,
//               boughtFrom: change.doc.data().boughtFrom,
//               itemCost: change.doc.data().itemCost,
//               itemName: change.doc.data().itemName,
//               id: change.doc.id
//             }
//             this.setState({ items: [changed].concat(this.state.items) });
//              console.log("New  Item: ", changed);
//         }
//         //for future if needed
//         if (change.type === "modified") {
//             console.log("Modified item: ", change.doc.data());
//         }
//         if (change.type === "removed") {
//           this.setState(prevState=> {
//             const items = prevState.items.filter( item => item.id !== change.doc.id);
//             return {items}
//           })
//             console.log("Removed item: ", change.doc.data());
//         }
//       });
//     });

//     //Add data from firestore to local state
//     fire.firestore().collection('Items').get()
//       .then(data => {
//         let items = []
//         data.forEach(doc => {
//           let item = {
//             sold: doc.data().Sold,
//             boughtFrom: doc.data().boughtFrom,
//             itemCost: doc.data().itemCost,
//             itemName: doc.data().itemName,
//             id: doc.id
//           }
//           items.push(item)
//         })
//         this.setState({items: items})
//       })
//   }

//   deleteItem(message, e){
//     e.preventDefault();
//     fire.firestore().collection('Items').doc(message.id).delete().then(function(){
//       console.log("Document Deleted")
//     }).catch(function(error){
//       console.error("Error removing document: ", error);
//     });
//   }

//   render() {
//     return (
//       <form>
//         <ul>
//           {
//            this.state.items.map( item => 
//             <li 
//               key={item.id}>{item.itemName}
//               <button onClick={this.deleteItem.bind(this,item)}>Remove</button>
//             </li> )
//           }
//         </ul>
//       </form>
//     );
//   }
// }

// export default App;