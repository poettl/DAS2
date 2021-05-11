<?php
if (!empty($_POST)){
    $alphabet = htmlspecialchars($_POST['alphabet']);
    $passwordlength =  htmlspecialchars($_POST['passwordlength']);
    $passwordCount = htmlspecialchars($_POST['passwordcount']);
    $passwords = array();

    $alphaLength = strlen($alphabet) - 1;

    for($j= 0; $j<$passwordCount;$j++){
        $pass = array(); 
        for ($i = 0; $i < $passwordlength; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        $passwords[$j]=implode($pass);

    }

    unset($_POST);


}


?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Passwort Generator</title>
    <style>
      body {
        padding: 0 16px;
      }
      .main-container {
        display: flex;
        flex-direction: column;
      }
      input {
        margin-bottom: 8px;
      }
    </style>
  </head>
  <body style="display: flex; height: 100%; flex-direction: column">
    <h1>Passwort Generator</h1>
    <form class="main-container" action="index.php" method="post">
      <input placeholder="Passwortlänge" name="passwordlength" type="number" min="4" max="16" value="10" />
      <input
        placeholder="Anzahl ausgegebenen Passwörter"
        type="number"
        value="20"

        max="20"
        name="passwordcount"
      />
      <input
        placeholder="Alphabet zur Erzeugung der Passwörter"
        type="input"
        value="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!?"
        name="alphabet"
      />
      <div style="margin-left: auto; margin-right: auto">
        <input type="submit" />
      </div>
    </form>


    <div class="passwort-container">
    <?php
    if (!empty($passwords)){
        echo '<div>';
        echo $passwordCount;
        echo ' Passwörter mit einer Länge von ';
        echo $passwordlength;
        echo ' Zeichen wurden erstellt:';
        echo '</div>';
        echo '<ul>';
        for($j= 0; $j<count($passwords);$j++){
            echo '<li>';
            echo $passwords[$j];
            echo '</li>';
        }


        echo '</ul>';   
    }

    ?>
    </div>
  </body>
</html>
