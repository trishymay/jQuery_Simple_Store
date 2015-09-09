var images = [];
var shoppingCart = [];
var receipt = {};
var imagesSeen = [];
var purchased = [];
var totalPrice = 0;

var Img = (function () {
  var idCounter = 1;
  function product(src, alt, description, price, name) {
    this.src = src;
    this.alt = alt;
    this.description = description;
    this.price = price;
    this.name = name;
    this.id = idCounter++;
  }
  return product;
})();

function inCartVal () {
  $('.inCartVal').html('Shopping Cart (' + shoppingCart.length + ')');
}

function seen () {
  $('div img').not('.hidden').each(function() {
    for (var i = 0; i < images.length; i++) {
      if (('alt="' + $(this)[0].alt + '"' == images[i].alt) && (imagesSeen.indexOf(images[i]) == -1)) {
        imagesSeen.push(images[i]);
        break;
      }
    }
  });
}

function refresh () {
  $( '.products' ).html(function() {
    var imgs = '';
    for (var i = 0; i < images.length; i++) {
      imgs += '<div class="hidden"><img ' + images[i].src + images[i].alt +'><p class="description">' + images[i].description + '</p><p class="price">$' + images[i].price.toFixed(2) + '</p><button class="add" value="' + images[i].id + '">Add To Cart</button></div>';
    }
    return imgs;
  });

  (function () {
    var totalImages = images.length;
    if (images.length > 3) {
      $('.next button').removeClass('hidden');
      var totalImages = 3;
    }
    for (var i = 0; i < totalImages; i++) {
      $('.products').find('div').eq(i).removeClass('hidden');
    }
    seen();
  })();
}

//initialize page
(function () {
  images.push(new Img('src="./images/appleBlossom.jpg"', 'alt="apple blossom"', 'A beautiful apple tree in bloom with a stunning blue sky background', 79, 'Apple Blossom'));
  images.push(new Img('src="./images/butterfly.jpg"', 'alt="butterfly"', 'A vibrant butterfly perched atop a glorious pink-hued flower', 159, 'Butterfly'));
  images.push(new Img('src="./images/clouds.jpg"', 'alt="clouds"', 'A cloudy sky perfect to gaze upon with daydreams in mind', 99, 'Clouds'));
  images.push(new Img('src="./images/daisy.jpg"', 'alt="daisy"', 'Small and simple daisies, defying the odds and affirming life at summer\'s end', 179, 'Daisy'));
  images.push(new Img('src="./images/dandelion.jpg"', 'alt="dandelion"', 'Make a wish and blow away the remaining wisps of this lovely dandelion', 300, 'Dandelion'));
  images.push(new Img('src="./images/forest.jpg"', 'alt="forest"', 'Trees - for when you can\'t go camping, but you really need to go camping', 129, 'Forest'));
  images.push(new Img('src="./images/lake.jpg"', 'alt="lake"', 'A peaceful sunny day at the lake with all the fish you can catch', 19, 'Lake'));
  images.push(new Img('src="./images/mountainPath.jpg"', 'alt="mountain path"', 'A gentle wooded path in the mountains hopefully leading somewhere magical', 39, 'Mountain Path'));
  images.push(new Img('src="./images/pinecone.jpg"', 'alt="pinecone"', 'An adoreable pinecone at play in the woods taking a day for fun and enjoyment', 49, 'Pinecone'));
  images.push(new Img('src="./images/rose.jpg"', 'alt="rose"', 'A close up view of a stunning rose, fresh with morning dew', 149, 'Rose'));
  images.push(new Img('src="./images/stones.jpg"', 'alt="stones"', 'A peaceful view of some stones artistically stacked with a mountainous background', 99, 'Stones'));
  images.push(new Img('src="./images/wheat.jpg"', 'alt="wheat"', 'Wow - that sure is some wheat, and you can never get too much wheat', 59, 'Wheat'));
  refresh();
})();

//view full size image
$('.image').on('click', 'img', function() {
  $('.image').toggleClass('hidden');
  $('header').toggleClass('hidden');
  $('.lower').toggleClass('hidden');
  $('.large').html('<img class="full" src="' + $(this).attr('src') + '"" alt="' +
  $(this).attr('alt') + '">');
  $('.full').height($(window).height());
});

//next button
$('.next').click(function() {
  var $lastIndex = $('.products div').not('.hidden').filter(':last').index() + 1;
  $('.products div').not('.hidden').addClass('hidden');
  for (var i = 0; i < 3; i++) {
    if ($lastIndex < images.length) {
      $('.products').find('div').eq($lastIndex).removeClass('hidden');
    }
    $lastIndex++;
    if ($lastIndex == images.length) {
      $('.next button').addClass('hidden');
      break;
    }
  }
  $('.back button').removeClass('hidden');
  seen();
});

//back button
$('.back').click(function() {
  var $firstIndex = $('.products div').not('.hidden').filter(':first').index() - 1;
  $('.products div').not('.hidden').addClass('hidden');
  for (var i = 0; i < 3; i++) {
    if ($firstIndex >= 0) {
      $('.products').find('div').eq($firstIndex).removeClass('hidden');
    }
    $firstIndex--;
    if ($firstIndex < 0) {
      $('.back button').addClass('hidden');
      break;
    }
  }
  $('.next button').removeClass('hidden');
  seen();
});

//add item to shopping cart
$('body').on('click', '.add', function() {
  var $id = Number($(this)[0].value);
  $(this).parent().addClass('inCart');
  $(this).attr({class: 'remove productScreen', value: $id});
  $(this).html('Remove From Cart');
  for (var i = 0; i < images.length; i++) {
    if (($id === images[i].id) && (shoppingCart.indexOf(images[i]) == -1)) {
      shoppingCart.push(images[i]);
      break;
    }
  }
  inCartVal();
});

//remove item from shopping cart
$('body').on('click', '.remove', function() {
  var $id = Number($(this)[0].value);
  var className = $(this).attr('class')
  $('.products button[value=' + $id + ']').parent().removeClass('inCart');
  for (var i = 0; i < shoppingCart.length; i++) {
    if ($id === shoppingCart[i].id) {
      shoppingCart.splice(i, 1);
      break;
    }
  }
  if (className === 'remove productScreen') {
    $(this).attr({class: 'add', value: $id});
    $(this).html('Add To Cart');
  } else {
    viewCart();
  }
  inCartVal();
});

//view shopping cart
function viewCart () {
  $('.cart').removeClass('hidden');
  $('.products').addClass('hidden');
  $('.lower').addClass('hidden');
  $('.cart').html(function() {
    var cartItems = '';
    if (!shoppingCart.length) {
      cartItems += '<div class="confirm"><p>Your Shopping Cart is Empty</p><button class="continue shop">';
    } else {
      totalPrice = 0;
      for (var i = 0; i < shoppingCart.length; i++) {
        cartItems += '<div class="small"><img ' + shoppingCart[i].src + shoppingCart[i].alt +
        '><p class="name">' + shoppingCart[i].name + '</p><p class="priceSmall">$' +
        shoppingCart[i].price.toFixed(2) + '</p><button class="remove" value="' +
        shoppingCart[i].id + '">Remove From Cart</button></div>';
        totalPrice += Number(shoppingCart[i].price.toFixed(2));
      }
      cartItems += '<div class="confirmOrder"><p class="total">Total Price: $' + totalPrice +
      '</p><button class="purchase">Complete Order</button><button class="continue">';
    }
    cartItems += 'Continue Shopping</button></div>'
    return cartItems;
  });
  $('.confirm').css({'minHeight': $(window).height() * .6, 'minWidth': $(window).width() * .6});
}

$('.checkout').on('click', 'button', function() {
  viewCart();
});

//complete order
$('.cart').on('click', '.purchase', function() {
  receipt.totalPrice = totalPrice;
  receipt.totalItemsPurchased = shoppingCart.length;
  receipt.items = shoppingCart.slice();
  purchased = purchased.concat(shoppingCart);
  while (shoppingCart.length) {
    var current = shoppingCart.pop();
    for (var i = 0; i < images.length; i++) {
      if (current.id === images[i].id) {
        images.splice(i, 1);
        break;
      }
    }
  }
  totalPrice = 0;
  inCartVal();
  $('.cart').html(function() {
    var receiptInfo = '<div class="confirm"><p>Thank you for your purchase.  Your order is complete.</p><table><tr><th>Image</th><th>Price</th></tr>'
    for (var i = 0; i < receipt.totalItemsPurchased; i++) {
      receiptInfo += '<tr><td>' + receipt.items[i].name + '</td><td>' +
      receipt.items[i].price + '</td></tr>';
    }
    receiptInfo += '<tr><th>Total</th><th>$' + receipt.totalPrice + '</th></tr></table>' +
    '<button class="continue">Continue Shopping</button></div>'
    return receiptInfo;
  });
  $('.confirm').css({'minHeight': $(window).height() * .6, 'minWidth': $(window).width() * .6});
});


//continue shopping
$('.cart').on('click', '.continue', function() {
  if (!shoppingCart.length)
    refresh();
  $('.products').removeClass('hidden');
  $('header').removeClass('hidden');
  $('.lower').removeClass('hidden');
  $('.large').addClass('hidden');
  $('.cart').addClass('hidden');
});
