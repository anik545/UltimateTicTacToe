from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

db = SQLAlchemy(app)

class Saves(db.Model):
    name = db.Column('name', db.String(), unique=True, primary_key=True)
    save = db.Column('save', db.String())

    def __init__(self, name, save):
        self.name = name
        self.save = save

@app.route('/')
def main():
    return render_template('index.html')


@app.route('/ttt')
def ttt():
    return render_template('ttt.html')


@app.route('/cttt')
def cttt():
    return render_template('cttt.html')


@app.route('/_save', methods=['POST'])
def save():
    try:
        name = request.form.get('name', '')
        save = request.form.get('save', '')
        print(name, save)
        s = Saves(name, save)
        db.session.add(s)
        db.session.commit()
        return jsonify()
    except Exception as e:
        print(e)


@app.route('/_load')
def load():
    name = request.args.get('name', '')
    s = Saves.query.filter_by(name=name).first()
    if not s:
        return jsonify(error='no save with that name exists')
    return jsonify(save=s.save)

if __name__ == "__main__":
    app.debug = True
    app.run()
