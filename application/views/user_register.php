<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>

<form method="post" action="/users/register">
    <label>
        nickname:
        <input type="text" name="nickname">                        
    </label>
    <br/>
    <label>
        first name:
        <input type="text" name="first_name">                        
    </label>
    <br/>
    <label>
        last name:
        <input type="text" name="last_name">                        
    </label>
    <br/>
    <label>
        email:
        <input type="text" name="email">                        
    </label>
    <br/>
    <label>
        password:
        <input type="text" name="password">        
    </label>
    <br/>
    <input type="submit" value="Register"> 
    or <a href="/users/login">Login</a>
    <?php if (!empty($message)) : ?>
        <div class="error_message" >
            <p style="color:red;">
                <?= $message ?>
            </p>
        </div>
    <?php endif; ?>
</form>