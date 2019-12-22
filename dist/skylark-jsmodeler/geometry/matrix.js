/**
 * skylark-jsmodeler - A version of jsmodeler that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-jsmodeler/
 * @license MIT
 */
define(["../core/jsm"],function(r){return r.MatrixIdentity=function(){var r=[];return r[0]=1,r[1]=0,r[2]=0,r[3]=0,r[4]=0,r[5]=1,r[6]=0,r[7]=0,r[8]=0,r[9]=0,r[10]=1,r[11]=0,r[12]=0,r[13]=0,r[14]=0,r[15]=1,r},r.MatrixClone=function(r){var t=[];return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],t[9]=r[9],t[10]=r[10],t[11]=r[11],t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15],t},r.MatrixTranspose=function(r){var t=[];return t[0]=r[0],t[1]=r[4],t[2]=r[8],t[3]=r[12],t[4]=r[1],t[5]=r[5],t[6]=r[9],t[7]=r[13],t[8]=r[2],t[9]=r[6],t[10]=r[10],t[11]=r[14],t[12]=r[3],t[13]=r[7],t[14]=r[11],t[15]=r[15],t},r.MatrixVectorMultiply=function(r,t){var n=t[0],a=t[1],i=t[2],o=t[3],u=r[0],e=r[1],M=r[2],c=r[3],v=r[4],f=r[5],l=r[6],x=r[7],s=r[8],y=r[9],p=r[10],h=r[11],R=r[12],d=r[13],z=r[14],m=r[15],C=[];return C[0]=n*u+a*v+i*s+o*R,C[1]=n*e+a*f+i*y+o*d,C[2]=n*M+a*l+i*p+o*z,C[3]=n*c+a*x+i*h+o*m,C},r.MatrixMultiply=function(r,t){var n=r[0],a=r[1],i=r[2],o=r[3],u=r[4],e=r[5],M=r[6],c=r[7],v=r[8],f=r[9],l=r[10],x=r[11],s=r[12],y=r[13],p=r[14],h=r[15],R=t[0],d=t[1],z=t[2],m=t[3],C=t[4],I=t[5],T=t[6],V=t[7],w=t[8],A=t[9],Z=t[10],j=t[11],D=t[12],N=t[13],Q=t[14],X=t[15],Y=[];return Y[0]=n*R+a*C+i*w+o*D,Y[1]=n*d+a*I+i*A+o*N,Y[2]=n*z+a*T+i*Z+o*Q,Y[3]=n*m+a*V+i*j+o*X,Y[4]=u*R+e*C+M*w+c*D,Y[5]=u*d+e*I+M*A+c*N,Y[6]=u*z+e*T+M*Z+c*Q,Y[7]=u*m+e*V+M*j+c*X,Y[8]=v*R+f*C+l*w+x*D,Y[9]=v*d+f*I+l*A+x*N,Y[10]=v*z+f*T+l*Z+x*Q,Y[11]=v*m+f*V+l*j+x*X,Y[12]=s*R+y*C+p*w+h*D,Y[13]=s*d+y*I+p*A+h*N,Y[14]=s*z+y*T+p*Z+h*Q,Y[15]=s*m+y*V+p*j+h*X,Y},r.MatrixDeterminant=function(r){var t=r[0],n=r[1],a=r[2],i=r[3],o=r[4],u=r[5],e=r[6],M=r[7],c=r[8],v=r[9],f=r[10],l=r[11],x=r[12],s=r[13],y=r[14],p=r[15];return(t*u-n*o)*(f*p-l*y)-(t*e-a*o)*(v*p-l*s)+(t*M-i*o)*(v*y-f*s)+(n*e-a*u)*(c*p-l*x)-(n*M-i*u)*(c*y-f*x)+(a*M-i*e)*(c*s-v*x)},r.MatrixInvert=function(t){var n=t[0],a=t[1],i=t[2],o=t[3],u=t[4],e=t[5],M=t[6],c=t[7],v=t[8],f=t[9],l=t[10],x=t[11],s=t[12],y=t[13],p=t[14],h=t[15],R=n*e-a*u,d=n*M-i*u,z=n*c-o*u,m=a*M-i*e,C=a*c-o*e,I=i*c-o*M,T=v*y-f*s,V=v*p-l*s,w=v*h-x*s,A=f*p-l*y,Z=f*h-x*y,j=l*h-x*p,D=R*j-d*Z+z*A+m*w-C*V+I*T;if(r.IsZero(D))return null;var N=[];return N[0]=(e*j-M*Z+c*A)/D,N[1]=(i*Z-a*j-o*A)/D,N[2]=(y*I-p*C+h*m)/D,N[3]=(l*C-f*I-x*m)/D,N[4]=(M*w-u*j-c*V)/D,N[5]=(n*j-i*w+o*V)/D,N[6]=(p*z-s*I-h*d)/D,N[7]=(v*I-l*z+x*d)/D,N[8]=(u*Z-e*w+c*T)/D,N[9]=(a*w-n*Z-o*T)/D,N[10]=(s*C-y*z+h*R)/D,N[11]=(f*z-v*C-x*R)/D,N[12]=(e*V-u*A-M*T)/D,N[13]=(n*A-a*V+i*T)/D,N[14]=(y*d-s*m-p*R)/D,N[15]=(v*m-f*d+l*R)/D,N},r.MatrixTranslation=function(r,t,n){var a=[];return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=1,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=1,a[11]=0,a[12]=r,a[13]=t,a[14]=n,a[15]=1,a},r.MatrixRotation=function(r,t,n){var a=r.Clone().Normalize(),i=a.x,o=a.y,u=a.z,e=i*i,M=o*o,c=u*u,v=Math.sin(t),f=Math.cos(t),l=[];if(void 0===n||null===n)l[0]=e+(M+c)*f,l[1]=i*o*(1-f)+u*v,l[2]=i*u*(1-f)-o*v,l[3]=0,l[4]=i*o*(1-f)-u*v,l[5]=M+(e+c)*f,l[6]=o*u*(1-f)+i*v,l[7]=0,l[8]=i*u*(1-f)+o*v,l[9]=o*u*(1-f)-i*v,l[10]=c+(e+M)*f,l[11]=0,l[12]=0,l[13]=0,l[14]=0,l[15]=1;else{var x=n.x,s=n.y,y=n.z;l[0]=e+(M+c)*f,l[1]=i*o*(1-f)+u*v,l[2]=i*u*(1-f)-o*v,l[3]=0,l[4]=i*o*(1-f)-u*v,l[5]=M+(e+c)*f,l[6]=o*u*(1-f)+i*v,l[7]=0,l[8]=i*u*(1-f)+o*v,l[9]=o*u*(1-f)-i*v,l[10]=c+(e+M)*f,l[11]=0,l[12]=(x*(M+c)-i*(s*o+y*u))*(1-f)+(s*u-y*o)*v,l[13]=(s*(e+c)-o*(x*i+y*u))*(1-f)+(y*i-x*u)*v,l[14]=(y*(e+M)-u*(x*i+s*o))*(1-f)+(x*o-s*i)*v,l[15]=1}return l},r.MatrixRotationQuaternion=function(r){var t=r[0],n=r[1],a=r[2],i=r[3],o=t+t,u=n+n,e=a+a,M=t*o,c=t*u,v=t*e,f=n*u,l=n*e,x=a*e,s=i*o,y=i*u,p=i*e,h=[];return h[0]=1-(f+x),h[1]=c+p,h[2]=v-y,h[3]=0,h[4]=c-p,h[5]=1-(M+x),h[6]=l+s,h[7]=0,h[8]=v+y,h[9]=l-s,h[10]=1-(M+f),h[11]=0,h[12]=0,h[13]=0,h[14]=0,h[15]=1,h},r.MatrixRotationX=function(r){var t=Math.sin(r),n=Math.cos(r),a=[];return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=n,a[6]=t,a[7]=0,a[8]=0,a[9]=-t,a[10]=n,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},r.MatrixRotationY=function(r){var t=Math.sin(r),n=Math.cos(r),a=[];return a[0]=n,a[1]=0,a[2]=-t,a[3]=0,a[4]=0,a[5]=1,a[6]=0,a[7]=0,a[8]=t,a[9]=0,a[10]=n,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},r.MatrixRotationZ=function(r){var t=Math.sin(r),n=Math.cos(r),a=[];return a[0]=n,a[1]=t,a[2]=0,a[3]=0,a[4]=-t,a[5]=n,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=1,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},r.ApplyTransformation=function(t,n){var a=[];a[0]=n.x,a[1]=n.y,a[2]=n.z,a[3]=1;var i=r.MatrixVectorMultiply(t,a);return new r.Coord(i[0],i[1],i[2])},r.ApplyRotation=function(t,n){var a=[];a[0]=n.x,a[1]=n.y,a[2]=n.z,a[3]=0;var i=r.MatrixVectorMultiply(t,a);return new r.Coord(i[0],i[1],i[2])},r});
//# sourceMappingURL=../sourcemaps/geometry/matrix.js.map