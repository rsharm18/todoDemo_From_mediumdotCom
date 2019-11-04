import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { config } from './app.config';
import { Task } from './app.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'todoDemo';
  tasks: Observable<any[]>;
  myTask: string;
  editMode: boolean = false;
  taskToEdit: any = {};

  constructor(private db: AngularFirestore, private taskService: AppService)
  {

  }

  ngOnInit()
  {
    this.tasks = this.db
    .collection(config.collection_endpoint)
    .snapshotChanges()
    .pipe(map(actions => {
      return actions.map(a => {
        //Get document data
        const data = a.payload.doc.data() as Task;
        //Get document id
        const id = a.payload.doc.id;
        //Use spread operator to add the id to the document data
        return { id, ...data };
      });
    }));
    console.log(this.tasks);
  }

  edit(task) {
    console.log(task);
    //Set taskToEdit and editMode
    this.taskToEdit = task;
    this.editMode = true;
    //Set form value
    this.myTask = task.description;
  } //edit

  saveTask() {
    if (this.myTask !== null) {
       //Get the input value
       let task = {
          description: this.myTask
       };
       if (!this.editMode) {
          console.log(task);
          this.taskService.addTask(task);
       } else {
          //Get the task id
          let taskId = this.taskToEdit.id;
          //update the task
          this.taskService.updateTask(taskId, task);
       }
       //set edit mode to false and clear form
       this.editMode = false;
       this.myTask = "";
    }
 } //saveTask

 deleteTask(task) {
  //Get the task id
  let taskId = task.id;
  //delete the task
  this.taskService.deleteTask(taskId);
} //deleteTask

 
}
