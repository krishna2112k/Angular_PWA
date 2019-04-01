import { Component } from '@angular/core';
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore'
import { TestModel } from './test-model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pwa-app';
  item : TestModel ={}
  testModelCollection : AngularFirestoreCollection<any>
  list : Observable<TestModel[]>

  ngOnInit(){
    this.list = this.testModelCollection.snapshotChanges().pipe(
      map(actions => actions.map(a =>{
        const data = a.payload.doc.data() as TestModel;
        const id  = a.payload.doc.id;
        return { id, ...data};
      }))
    )
  }

  constructor(
    private afs : AngularFirestore,
    private afAuth : AngularFireAuth){
    this.testModelCollection = afs.collection<TestModel>('TestModel')
  }

  public save(){
      this.testModelCollection.add(this.item);
      this.item = {}
  }

  public login(){
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then((credential : auth.UserCredential)=>{
      console.log(credential.user.email)
    })
  }
}
