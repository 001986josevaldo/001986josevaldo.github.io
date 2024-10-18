from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def homepage():
    return render_template("index.html")  # Renderiza o arquivo indice.html

# colocar site no ar
if __name__ == "__main__":
    app.run(debug=True)

    # servidor heroku
    