import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  sorting_method = new Subject<string>();

  constructor(private http: HttpClient) { }

  async getTasks(parentID){
    const res = await (this.http.get<any>("http://localhost:8080/api/tasks/" + parentID)).toPromise();
    return res.tasks;
  }

  async addTask(task){
    return await this.http.post<any>("http://localhost:8080/api/tasks/", this.strip_task(task)).toPromise();
  }

  async updateTask(task){
    return await this.http.put<any>("http://localhost:8080/api/tasks/", this.strip_task(task)).toPromise();
  }

  async deleteTask(task){
    return await this.http.delete<any>("http://localhost:8080/api/tasks/" + task._id).toPromise();
  }

  strip_task(task){
    return {title: task.title, content: task.content, deadline: task.deadline, _id: task._id, complete: task.complete, parent: task.parent};
  }

  change_sorting_method(method: string){
    this.sorting_method.next(method);
  }

}
