import{a as v,b as p,c as h,d as b,e as M,f as y,g as C,h as x,i as E,j as N,k as T,l as B,m as I}from"./chunk-A3LBYIUB.js";import{E as w,F,G as L,M as D,N as G,j as S}from"./chunk-FQN7SRPL.js";import{Fa as d,Ya as f,_ as n,ab as t,bb as a,cb as s,da as u,hb as c,qb as m,ub as g}from"./chunk-ZJB6LXJZ.js";var X=(()=>{let r=class r{constructor(){this.formBuilder=n(x),this.http=n(S),this.loginService=n(F),this.messageService=n(w),this.form=this.formBuilder.nonNullable.group({username:["",p.required],password:["",p.required]})}onSubmit(){if(!this.form.valid){this.sendErrorMessage("Please fill out all fields");return}let i=this.form.getRawValue();this.http.post(L.apiUrl+"/authenticate",i).subscribe({next:e=>{this.loginService.login(e)},error:e=>{let o="Server Error. Please try again later.";e.status===401&&(o="Invalid Credentials. Please try again."),this.sendErrorMessage(o)}})}sendErrorMessage(i){this.messageService.sendErrorMessage("Login failed!",i)}};r.\u0275fac=function(e){return new(e||r)},r.\u0275cmp=u({type:r,selectors:[["my-app-login"]],standalone:!0,features:[g],decls:15,vars:1,consts:[[3,"ngSubmit","formGroup"],[1,"mt-5"],["id","username","pInputText","","type","text","formControlName","username"],["for","username"],["id","password","pInputText","","type","password","formControlName","password"],["for","password"],["label","Submit","type","submit"]],template:function(e,o){e&1&&(t(0,"h1"),m(1,"Login"),a(),t(2,"form",0),c("ngSubmit",function(){return o.onSubmit()}),t(3,"div",1)(4,"p-floatLabel"),s(5,"input",2),t(6,"label",3),m(7,"Username"),a()()(),t(8,"div",1)(9,"p-floatLabel"),s(10,"input",4),t(11,"label",5),m(12,"Password"),a()()(),t(13,"div",1),s(14,"p-button",6),a()()),e&2&&(d(2),f("formGroup",o.form))},dependencies:[E,M,v,h,b,y,C,T,N,I,B,G,D]});let l=r;return l})();export{X as LoginComponent};