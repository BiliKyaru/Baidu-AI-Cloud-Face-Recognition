import time

import requests
from aip import AipFace
from flask import Flask, render_template, request
import pymysql


app = Flask(__name__, template_folder='templates')
app.config['UPLOAD_FOLDER'] = './'
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024
APP_ID = 'Your APP_ID'
API_KEY = 'Your API_KEY'
SECRET_KEY = 'Your SECRET_KEY'

def connects():
    host = '127.0.0.1'
    port = 3306
    user = 'Your DB Name'
    password = ''
    db = 'baidu_face'
    conn = pymysql.connect(host=host, port=port, user=user, charset='utf8', password=password, db=db)
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    return cursor, conn

def process(img):
    groupId = 'Your Baidu AI Cloud Face Recognition ID'
    imageType = 'BASE64'
    image = img
    client = AipFace(APP_ID, API_KEY, SECRET_KEY)
    options = {}
    options["max_face_num"] = 3
    options["match_threshold"] = 70
    options["quality_control"] = "NORMAL"
    options["liveness_control"] = "LOW"
    options["max_user_num"] = 3
    face = client.multiSearch(image, imageType, groupId, options)
    return face


def add(img, info):
    client = AipFace(APP_ID, API_KEY, SECRET_KEY)

    image = img
    imageType = "BASE64"
    groupId = "Your Baidu AI Cloud Face Recognition ID"
    userId = info

    """ 调用人脸注册 """
    # client.addUser(image, imageType, groupId, userId);

    """ 如果有可选参数 """
    options = {}
    options["user_info"] = info
    options["quality_control"] = "NORMAL"
    options["liveness_control"] = "LOW"
    options["action_type"] = "REPLACE"

    """ 带参数调用人脸注册 """
    jsons = client.addUser(image, imageType, groupId, userId, options)
    return jsons


def deleteUsers(user):
    client = AipFace(APP_ID, API_KEY, SECRET_KEY)

    groupId = "Your Baidu AI Cloud Face Recognition ID"
    userId = user
    """ 调用删除用户 """
    data = client.deleteUser(groupId, userId);
    return data


def getAllGroupUsers():
    client = AipFace(APP_ID, API_KEY, SECRET_KEY)

    groupId = "Your Baidu AI Cloud Face Recognition ID"

    """ 如果有可选参数 """
    options = {}
    options["start"] = 0
    options["length"] = 100

    """ 带参数调用获取用户列表 """
    data = client.getGroupUsers(groupId, options)
    return data


def OpenDoor():
    res = requests.get('http://127.0.0.1')
    if res.status_code == 200:
        return 'OK'
    else:
        return 'NOT'


# 定义一个函数 timeformat，用于格式化时间
def timeformat(t):
    if t is not None:
        # 三目表达式：如果 t 大于 9，则返回 t 的字符串表示，否则返回 '0' + t 的字符串表示
        return str(t) if t > 9 else '0' + str(t)
    else:
        # 如果传入的时间参数为 None，则返回 '00'
        return '00'


@app.route('/allLog', methods=['POST'])
def allLog():
    # SQL 查询语句，从名为 'user' 的表中选择 'user' 和 'time' 列
    sql = 'select user, `time` from user'
    # 调用 connects 函数获取游标对象 curse 和连接对象 conn
    curse, conn = connects()
    # 执行 SQL 查询语句
    curse.execute(sql)
    # 获取所有查询结果
    datas = curse.fetchall()
    print(datas)
    return datas


@app.route('/deleteUser', methods=['POST', 'GET'])
def delete():
    # 从请求的表单中获取名为 'user' 的参数值
    user = request.form['user']
    # 调用 deleteUsers 函数，传入 'user' 参数，获取删除操作的结果
    data = deleteUsers(user)
    print(data)
    return data


@app.route("/register", methods=['POST', 'GET'])
def register():
    # 从请求的表单中获取名为 'name' 和 'img' 的参数值
    data = {
        'name': request.form['name'],
        'img': request.form['img'].split(',')[1]
    }
    # 如果 'name' 参数不为空
    if data['name'] != '':
        # 调用 add 函数，传入 'img' 和 'name' 参数，获取百度API的响应
        baidu_rep = add(data['img'], data['name'])
        return baidu_rep
    else:
        return {'error': '名字不为空'}


@app.route('/HasPeople', methods=['POST'])
def HasPleplo():
    # 调用 OpenDoor 函数获取开门状态
    stats = OpenDoor()
    if stats == 'OK':
        # 构建 SQL 插入语句
        sql = 'insert into user(user, time) values(%s, %s)'
        user = request.form['user']
        times = time.localtime()
        # 调用 connects 函数获取数据库游标对象 cursor 和连接对象 conn
        cursor, conn = connects()
        cursor.execute(sql, [user, times])
        conn.commit()
        return {'msg': 'ok'}
    else:
        return {'msg': 'error'}


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/getUserList', methods=['POST', 'GET'])
def getUserList():
    # 从请求的表单中获取名为 'type' 的参数值
    i = request.form['type']
    print(i)
    # 调用 getAllGroupUsers 函数获取用户列表数据
    data = getAllGroupUsers()
    if (data['error_msg'] == 'SUCCESS'):
        print(data["result"]["user_id_list"])
        return data["result"]["user_id_list"]
    else:
        return {'error': '查询出错'}


@app.route("/videoUpper", methods=['POST', 'GET'])
def video():
    img = request.form['file']
    baidu_rep = process(img.split(',')[1])
    return baidu_rep


@app.route("/login")
def login():
    return render_template('login.html')


@app.route("/logging")
def logging():
    return render_template('logging.html')


@app.route("/admin")
def admin():
    return render_template('admin.html')


@app.route("/user")
def user():
    return render_template('user.html')


@app.route("/index")
def quit():
    return render_template('index.html')


def main():
    app.run()


if __name__ == "__main__":
    main()
